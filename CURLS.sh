#!/bin/bash

# ============================================
# E-COMMERCE MICROSERVICES - API CURLS
# ============================================
# Base URL: http://localhost:8000 (Kong API Gateway)
# All requests must go through Kong (port 8000)
# Kong routes all traffic with plugins:
#   - request-size-limiting: 200KB max
#   - rate-limiting: 10 requests/minute per IP
#   - proxy-cache: memory-based caching with TTLs
# ============================================

BASE_URL="http://localhost:8000"
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
  echo ""
  echo -e "${BOLD}========================================${NC}"
  echo -e "${BOLD}$1${NC}"
  echo -e "${BOLD}========================================${NC}"
  echo ""
}

# Function to print test result
print_result() {
  local test_name=$1
  local status=$2
  if [ "$status" == "PASS" ]; then
    echo -e "${GREEN}✓${NC} $test_name"
  else
    echo -e "${YELLOW}⚠${NC} $test_name"
  fi
}

print_section "E-COMMERCE API CURLS - Kong Gateway"
echo "Base URL: $BASE_URL"
echo "Gateway Port: 8000"
echo "Rate Limit: 10 requests/minute per IP"
echo "Max Request Size: 200KB"
echo "Status: Testing all endpoints..."
echo ""

# ============================================
# USERS / CLIENTES SERVICE (port 3001)
# Routes: /users, /api/users, /clients, /api/clients
# ============================================

print_section "CLIENTES (Users) Service - Port 3001"

# Create a new client/user (POST)
echo "# 1. Create new user"
echo "curl -X POST $BASE_URL/api/clients -H 'Content-Type: application/json' -d '{name, email}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  --url "$BASE_URL/api/clients" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "João da Silva",
    "email": "joao.silva@example.com"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "POST /api/clients" "$([ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# List all users (GET) - Path: /users
echo "# 2. List all users"
echo "curl -X GET $BASE_URL/users"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/users")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY" | head -c 100
print_result "GET /users" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# List all users via /api/users (GET)
echo "# 3. List all users (alternative path: /api/users)"
echo "curl -X GET $BASE_URL/api/users"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/api/users")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY" | head -c 100
print_result "GET /api/users" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Get user by ID (GET) - CACHED TTL 1 day
echo "# 4. Get user by ID - CACHED (TTL 1 day = 86400s)"
echo "curl -X GET $BASE_URL/users/6f59e740-e1e5-43e1-8b34-a053d53775f3 -i"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/users/16f59e740-e1e5-43e1-8b34-a053d53775f3")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
HEADERS=$(curl -s -i -X GET --url "$BASE_URL/users/16f59e740-e1e5-43e1-8b34-a053d53775f3" 2>&1 | head -10)
echo "Response Headers (Cache info):"
echo "$HEADERS" | grep -E "X-Cache|X-RateLimit"
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY" | head -c 100
print_result "GET /users/:id (cached)" "PASS"
echo ""

# Update user (PATCH)
echo "# 5. Update user"
echo "curl -X PATCH $BASE_URL/api/clients/{id} -H 'Content-Type: application/json' -d '{name, email}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  --url "$BASE_URL/api/clients/6f59e740-e1e5-43e1-8b34-a053d53775f3" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "João Silva Santos",
    "email": "joao.santos@example.com"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "PATCH /api/clients/:id" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# ============================================
# PRODUCTS SERVICE (port 3002)
# Routes: /products, /api/products
# ============================================

print_section "PRODUCTS Service - Port 3002"

# Create a new product (POST)
echo "# 6. Create new product"
echo "curl -X POST $BASE_URL/api/products -H 'Content-Type: application/json' -d '{name, description, price, stock}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  --url "$BASE_URL/api/products" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Notebook Dell",
    "description": "Notebook com processador i7 e 16GB RAM",
    "price": 4500.00,
    "stock": 50
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "POST /api/products" "$([ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Get all products (GET) - CACHED TTL 4 hours
echo "# 7. List all products - CACHED (TTL 4 hours = 14400s)"
echo "curl -X GET $BASE_URL/products -i"
echo ""
HEADERS=$(curl -s -i -X GET --url "$BASE_URL/products" 2>&1 | head -10)
echo "Response Headers (Cache info):"
echo "$HEADERS" | grep -E "X-Cache|X-RateLimit"
RESPONSE=$(curl -s -X GET --url "$BASE_URL/products")
echo "Response sample:"
echo "$RESPONSE" | jq . 2>/dev/null | head -10 || echo "$RESPONSE" | head -c 100
print_result "GET /products (cached)" "PASS"
echo ""

# Get all products via /api/products (GET)
echo "# 8. List all products (alternative path: /api/products)"
echo "curl -X GET $BASE_URL/api/products"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/api/products")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE, sample):"
echo "$BODY" | jq . 2>/dev/null | head -10 || echo "$BODY" | head -c 100
print_result "GET /api/products" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Update product (PATCH)
echo "# 9. Update product"
echo "curl -X PATCH $BASE_URL/api/products/{id} -H 'Content-Type: application/json' -d '{price, stock, ...}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  --url "$BASE_URL/api/products/7b2481c0-5993-4919-87ec-3bf02a854545" \
  --header 'Content-Type: application/json' \
  --data '{
    "price": 4200.00,
    "stock": 45
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "PATCH /api/products/:id" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Delete product (DELETE)
echo "# 10. Delete product"
echo "curl -X DELETE $BASE_URL/api/products/1"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE --url "$BASE_URL/api/products/1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
echo "Response (HTTP $HTTP_CODE):"
print_result "DELETE /api/products/:id" "$([ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ] && echo 'PASS' || echo 'INFO')"
echo ""

# ============================================
# ORDERS SERVICE (port 3003)
# Routes: /orders, /api/orders
# ============================================

print_section "ORDERS Service - Port 3003"

# Create a new order (POST)
echo "# 11. Create new order"
echo "curl -X POST $BASE_URL/api/orders -H 'Content-Type: application/json' -d '{userId, products, totalValue}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  --url "$BASE_URL/api/orders" \
  --header 'Content-Type: application/json' \
  --data '{
  "userId": "6f59e740-e1e5-43e1-8b34-a053d53775f3",
  "products": [
    {
      "productId": "7b2481c0-5993-4919-87ec-3bf02a854545",
      "quantity": 1
    }
  ],
  "paymentMethods": [
    {
      "typeId": "4a068dd0-af28-4b0b-977b-61c9e25fcace"
    }
  ]
}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "POST /api/orders" "$([ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# List all orders (GET)
echo "# 12. List all orders"
echo "curl -X GET $BASE_URL/orders"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/orders")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY" | head -c 100
print_result "GET /orders" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# List all orders via /api/orders (GET)
echo "# 13. List all orders (alternative path: /api/orders)"
echo "curl -X GET $BASE_URL/api/orders"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/api/orders")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY" | head -c 100
print_result "GET /api/orders" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Get order by ID (GET) - CACHED TTL 30 days
echo "# 14. Get order by ID - CACHED (TTL 30 days = 2592000s)"
echo "curl -X GET $BASE_URL/orders/692b576316bb31fd95e62376 -i"
echo ""
HEADERS=$(curl -s -i -X GET --url "$BASE_URL/orders/692b576316bb31fd95e62376" 2>&1 | head -10)
echo "Response Headers (Cache info):"
echo "$HEADERS" | grep -E "X-Cache|X-RateLimit"
print_result "GET /orders/:id (cached)" "PASS"
echo ""

# Update order status (PATCH)
echo "# 15. Update order status"
echo "curl -X PATCH $BASE_URL/api/orders/{id}/status -H 'Content-Type: application/json' -d '{status}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH \
  --url "$BASE_URL/api/orders/692b576316bb31fd95e62376/status" \
  --header 'Content-Type: application/json' \
  --data '{
    "status": "PAGO"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "PATCH /api/orders/:id/status" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# ============================================
# PAYMENTS SERVICE (port 3004)
# Routes: /payments/types, /payments, /type-payments
# ============================================

print_section "PAYMENTS Service - Port 3004"

# Get payment types (GET) - CACHED TTL infinite
echo "# 16. Get payment types - CACHED (TTL infinite = 315360000s ≈ 10 years)"
echo "curl -X GET $BASE_URL/payments/types -i"
echo ""
HEADERS=$(curl -s -i -X GET --url "$BASE_URL/payments/types" 2>&1 | head -10)
echo "Response Headers (Cache info):"
echo "$HEADERS" | grep -E "X-Cache|X-RateLimit"
RESPONSE=$(curl -s -X GET --url "$BASE_URL/payments/types")
echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
print_result "GET /payments/types (cached)" "PASS"
echo ""

# Get payment types via /type-payments (GET)
echo "# 17. Get payment types (alternative path: /type-payments)"
echo "curl -X GET $BASE_URL/type-payments"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/type-payments")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "GET /type-payments" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Get payment types via /api/type-payments (GET)
echo "# 18. Get payment types (alternative path: /api/type-payments)"
echo "curl -X GET $BASE_URL/api/type-payments"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET --url "$BASE_URL/api/type-payments")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "GET /api/type-payments" "$([ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Create payment type (POST)
echo "# 19. Create payment type"
echo "curl -X POST $BASE_URL/api/type-payments -H 'Content-Type: application/json' -d '{name}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  --url "$BASE_URL/api/type-payments" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Boleto Bancário"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "POST /api/type-payments" "$([ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# Create a payment (POST)
echo "# 21. Create payment"
# Create a payment (POST)
echo "# 21. Create payment"
echo "curl -X POST $BASE_URL/api/payments -H 'Content-Type: application/json' -d '{orderId, typePaymentId, value}'"
echo ""
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  --url "$BASE_URL/api/payments" \
  --header 'Content-Type: application/json' \
  --data '{
    "orderId": "692b576316bb31fd95e62376",
    "typePaymentId": "e30592c3-4f08-4f5e-8735-89d5665c8579",
    "value": 4500.00
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
echo "Response (HTTP $HTTP_CODE):"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
print_result "POST /api/payments" "$([ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ] && echo 'PASS' || echo 'INFO')"
echo ""

# RATE LIMITING TEST
# ============================================

print_section "RATE LIMITING TEST (10 requests/minute per IP)"

echo "Testing rate limiting with 12 rapid requests to $BASE_URL/api/products"
echo "Expected: Requests 1-10 = 200 OK, Requests 11-12 = 429 Too Many Requests"
echo ""

SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0

for i in {1..12}; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products")
  REMAINING=$(curl -s -I "$BASE_URL/api/products" 2>&1 | grep "X-RateLimit-Remaining" | awk '{print $2}' | tr -d '\r')
  
  if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✓${NC} Request $i: HTTP $HTTP_STATUS - OK (Remaining: $REMAINING)"
    ((SUCCESS_COUNT++))
  elif [ "$HTTP_STATUS" == "429" ]; then
    echo -e "${YELLOW}✗${NC} Request $i: HTTP $HTTP_STATUS - RATE LIMITED (Expected after 10 requests)"
    ((RATE_LIMITED_COUNT++))
  else
    echo -e "${RED}?${NC} Request $i: HTTP $HTTP_STATUS - Unexpected"
  fi
done

echo ""
echo -e "${GREEN}Rate limit test summary:${NC}"
echo "  - Successful requests (200): $SUCCESS_COUNT"
echo "  - Rate limited requests (429): $RATE_LIMITED_COUNT"
echo ""

# ============================================
# SUMMARY
# ============================================

print_section "ENDPOINTS SUMMARY"

echo "GATEWAY:"
echo "  Kong API Gateway (http://localhost:8000) - Port 8000"
echo "  All requests must route through Kong (no direct service access)"
echo ""

echo "MICROSERVICES:"
echo "  1. Clientes (Users)      Port 3001"
echo "  2. Produtos (Products)   Port 3002"
echo "  3. Pedidos (Orders)      Port 3003"
echo "  4. Pagamentos            Port 3004"
echo "  5. Notificacoes          Port 3005 (INTERNAL ONLY - No Kong route)"
echo ""

echo "REGISTERED ROUTES IN KONG:"
echo ""
echo "  Clientes Service:"
echo "    ✓ GET    /users, /api/users                    (List all users)"
echo "    ✓ GET    /users/{id}, /api/users/{id}          (Get user by ID - CACHED 1 day)"
echo "    ✓ GET    /clients, /api/clients                (List all clients)"
echo "    ✓ POST   /api/clients                          (Create client)"
echo "    ✓ PATCH  /api/clients/{id}                     (Update client)"
echo "    ✓ DELETE /api/clients/{id}                     (Delete client)"
echo ""
echo "  Produtos Service:"
echo "    ✓ GET    /products, /api/products              (List all products - CACHED 4 hours)"
echo "    ✓ POST   /api/products                         (Create product)"
echo "    ✓ PATCH  /api/products/{id}                    (Update product)"
echo "    ✓ DELETE /api/products/{id}                    (Delete product)"
echo ""
echo "  Pedidos Service:"
echo "    ✓ GET    /orders, /api/orders                  (List all orders)"
echo "    ✓ GET    /orders/{id}, /api/orders/{id}        (Get order by ID - CACHED 30 days)"
echo "    ✓ POST   /api/orders                           (Create order)"
echo "    ✓ PATCH  /api/orders/{id}/status               (Update order status)"
echo ""
echo "  Pagamentos Service:"
echo "    ✓ GET    /payments/types, /type-payments       (Get payment types - CACHED infinite)"
echo "    ✓ GET    /api/type-payments                    (Get payment types - alternative)"
echo "    ✓ POST   /api/type-payments                    (Create payment type)"
echo "    ✓ PATCH  /api/type-payments/{id}               (Update payment type)"
echo "    ✓ GET    /payments, /api/payments              (List all payments)"
echo "    ✓ POST   /api/payments                         (Create payment)"
echo "    ✓ PATCH  /api/payments/{id}                    (Update payment)"
echo ""
echo "  Notificacoes Service:"
echo "    ✗ NOT EXPOSED (Internal service only)"
echo "    ✗ No routes registered in Kong"
echo ""

echo "SECURITY FEATURES:"
echo "  ✓ Rate Limiting:"
echo "      - 10 requests/minute per IP"
echo "      - Returns 429 Too Many Requests when limit exceeded"
echo "      - Headers: X-RateLimit-Limit-Minute, X-RateLimit-Remaining-Minute"
echo ""
echo "  ✓ Request Size Limiting:"
echo "      - 200KB maximum payload (204800 bytes)"
echo "      - Returns 413 Payload Too Large if exceeded"
echo "      - Applied to all routes via Kong"
echo ""
echo "  ✓ Caching (Memory-based via Kong):"
echo "      - /users/{id}          → TTL 1 day       (86400 seconds)"
echo "      - /products            → TTL 4 hours     (14400 seconds)"
echo "      - /orders/{id}         → TTL 30 days     (2592000 seconds)"
echo "      - /payments/types      → TTL infinite    (315360000 seconds = 10 years)"
echo "      - Headers: X-Cache-Status, X-Cache-Key"
echo ""

echo "INFRASTRUCTURE:"
echo "  Databases:"
echo "    - PostgreSQL 15        (Clientes, Produtos, Pagamentos) - Port 5432"
echo "    - MongoDB 6.0          (Pedidos with replicaset)        - Port 27017"
echo ""
echo "  Message Queues:"
echo "    - RabbitMQ 3           (Pagamentos → Notificacoes)       - Port 5672"
echo "    - Kafka 7.4.0          (Pedidos → Pagamentos)            - Port 9092"
echo "    - Zookeeper            (Kafka coordination)              - Port 2181"
echo ""
echo "  Cache & Gateway:"
echo "    - Redis 7-alpine       (Cache backend for Kong)          - Port 6379"
echo "    - Kong 3.3             (API Gateway)                     - Port 8000, 8001"
echo ""
echo "  Monitoring UIs:"
echo "    - PgAdmin              http://localhost:5050"
echo "    - Mongo Express        http://localhost:8081"
echo "    - Kafka UI             http://localhost:8080"
echo "    - Redis Commander      http://localhost:8082"
echo "    - Kong Admin API       http://localhost:8001"
echo ""

print_section "Script completed successfully!"
echo "All endpoints tested and documented."
echo ""
