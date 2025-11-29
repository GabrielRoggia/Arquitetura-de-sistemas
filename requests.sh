#!/bin/bash

# Configuration
KONG_URL="http://localhost:8000"

# Helper to extract ID using jq
get_id() {
  echo $1 | jq -r '.id'
}

echo "Executing requests against Kong Gateway..."

# --- 1. Payment Type ---
echo "--- Creating Payment Type ---"
# Note: Using random name to avoid uniqueness constraint violation on re-runs
PAY_TYPE_NAME="Credit Card $(date +%s)"
RESP=$(curl -s -X POST $KONG_URL/type-payments \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$PAY_TYPE_NAME\"}")
echo "Response: $RESP"
PAY_TYPE_ID=$(get_id "$RESP")
echo "Created Payment Type ID: $PAY_TYPE_ID"
echo -e "\n"

echo "--- Get Type Payments (Cached - TTL Infinite) ---"
curl -s -X GET $KONG_URL/type-payments | jq .
echo -e "\n"


# --- 2. Client ---
echo "--- Creating Client ---"
EMAIL="john$(date +%s)@example.com"
RESP=$(curl -s -X POST $KONG_URL/clients \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"John Doe\", \"email\": \"$EMAIL\"}")
echo "Response: $RESP"
CLIENT_ID=$(get_id "$RESP")
echo "Created Client ID: $CLIENT_ID"
echo -e "\n"

echo "--- Get All Clients ---"
curl -s -X GET $KONG_URL/clients | jq .
echo -e "\n"

echo "--- Get Client by ID (Cached - TTL 1 day) ---"
curl -s -X GET $KONG_URL/clients/$CLIENT_ID | jq .
echo -e "\n"

echo "--- Update Client ---"
curl -s -X PATCH $KONG_URL/clients/$CLIENT_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}' | jq .
echo -e "\n"


# --- 3. Product ---
echo "--- Creating Product ---"
RESP=$(curl -s -X POST $KONG_URL/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse Gamer", "price": 50.0, "stock": 100}')
echo "Response: $RESP"
PRODUCT_ID=$(get_id "$RESP")
echo "Created Product ID: $PRODUCT_ID"
echo -e "\n"

echo "--- Get All Products (Cached - TTL 4 hours) ---"
curl -s -X GET $KONG_URL/products | jq .
echo -e "\n"

echo "--- Get Product by ID ---"
curl -s -X GET $KONG_URL/products/$PRODUCT_ID | jq .
echo -e "\n"

echo "--- Update Product ---"
curl -s -X PATCH $KONG_URL/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"price": 55.0}' | jq .
echo -e "\n"

echo "--- Update Product Stock ---"
curl -s -X PATCH $KONG_URL/products/$PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}' | jq .
echo -e "\n"


# --- 4. Order ---
echo "--- Creating Order ---"
# Note: Using price 55.0 because we updated it.
RESP=$(curl -s -X POST $KONG_URL/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$CLIENT_ID\", \"products\": [{\"productId\": \"$PRODUCT_ID\", \"quantity\": 1}], \"paymentMethods\": [{\"typeId\": \"$PAY_TYPE_ID\"}]}")
echo "Response: $RESP"
ORDER_ID=$(get_id "$RESP")
echo "Created Order ID: $ORDER_ID"
echo -e "\n"

echo "--- Get All Orders ---"
curl -s -X GET $KONG_URL/orders | jq .
echo -e "\n"

echo "--- Get Order by ID (Cached - TTL 30 days) ---"
curl -s -X GET $KONG_URL/orders/$ORDER_ID | jq .
echo -e "\n"

echo "--- Update Order Status ---"
curl -s -X PATCH $KONG_URL/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "AGUARDANDO_PAGAMENTO"}' | jq .
echo -e "\n"


# --- 5. Payments ---
echo "--- Create Manual Payment ---"
curl -s -X POST $KONG_URL/payments \
  -H "Content-Type: application/json" \
  -d "{\"orderId\": \"$ORDER_ID\", \"value\": 55, \"typePaymentId\": \"$PAY_TYPE_ID\"}" | jq .
echo -e "\n"

echo "--- Get Payments by Order ID ---"
echo "Waiting for Kafka processing..."
sleep 3
RESP=$(curl -s -X GET $KONG_URL/payments/order/$ORDER_ID)
echo "Response: $RESP"
echo $RESP | jq .

# Extract Payment ID (taking the first one, likely the one created via Kafka)
PAYMENT_ID=$(echo $RESP | jq -r '.[0].id')
echo "Processing Payment ID: $PAYMENT_ID"

echo "--- Process Payment ---"
# Value must match Order Total (55.0 * 1 = 55)
curl -s -X PATCH $KONG_URL/payments/$PAYMENT_ID/process \
  -H "Content-Type: application/json" \
  -d '{"value": 55}' | jq .
echo -e "\n"


# --- Cleanup ---
echo "--- Delete Product ---"
curl -s -X DELETE $KONG_URL/products/$PRODUCT_ID
echo -e "\n"

echo "--- Delete Client ---"
curl -s -X DELETE $KONG_URL/clients/$CLIENT_ID
echo -e "\n"

echo "Done."
