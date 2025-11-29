const axios = require('axios');

// Configurações - Pointing to Kong Gateway
const API_URL = 'http://localhost:8000';

async function seed() {
  console.log('Starting End-to-End Seed...');

  try {
    // 1. Create User (Cliente Service)
    console.log('--- Creating User ---');
    const userPayload = {
      name: 'John Doe',
      email: `johndoe${Date.now()}@example.com`
    };
    
    let user;
    try {
        const userRes = await axios.post(`${API_URL}/clients`, userPayload);
        user = userRes.data;
        console.log(`User created with ID: ${user.id}`);
    } catch (e) {
        console.error('Error creating user:', e.response?.data || e.message);
        throw e;
    }

    // 2. Create Product (Produto Service)
    console.log('--- Creating Product ---');
    const productPayload = {
      name: 'Laptop Gamer',
      price: 2500.00,
      stock: 100
    };
    
    let product;
    try {
        const prodRes = await axios.post(`${API_URL}/products`, productPayload);
        product = prodRes.data;
        console.log(`Product created with ID: ${product.id}`);
    } catch (e) {
         console.error('Error creating product:', e.response?.data || e.message);
         throw e;
    }

    // 3. Create Payment Type (Pagamentos Service) - Needed for Order
    console.log('--- Creating Payment Type ---');
    const paymentTypePayload = {
        name: `Credit Card ${Date.now()}`
    };
    
    let paymentType;
    try {
        const payTypeRes = await axios.post(`${API_URL}/type-payments`, paymentTypePayload);
        paymentType = payTypeRes.data;
        console.log(`Payment Type created with ID: ${paymentType.id}`);
    } catch (e) {
         console.error('Error creating payment type:', e.response?.data || e.message);
         // Might fail if name exists, try to fetch all and pick one
         const allTypes = await axios.get(`${API_URL}/type-payments`);
         if (allTypes.data.length > 0) {
             paymentType = allTypes.data[0];
             console.log(`Using existing Payment Type with ID: ${paymentType.id}`);
         } else {
             throw e;
         }
    }

    // 4. Create Order (Pedidos Service)
    console.log('--- Creating Order ---');
    const orderPayload = {
      userId: user.id,
      products: [
        { productId: product.id, quantity: 1 }
      ],
      paymentMethods: [
        { typeId: paymentType.id }
      ]
    };

    let order;
    try {
        const orderRes = await axios.post(`${API_URL}/orders`, orderPayload);
        order = orderRes.data;
        console.log(`Order created with ID: ${order.id}`);
        console.log('Order status:', order.status);
    } catch (e) {
        console.error('Error creating order:', e.response?.data || e.message);
        throw e;
    }

    console.log('--- Verifying Async Payment Creation (Kafka) ---');
    // Wait a bit for Kafka to process
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        const paymentsRes = await axios.get(`${API_URL}/payments/order/${order.id}`);
        const payments = paymentsRes.data;
        if (payments.length > 0) {
            console.log(`SUCCESS: Payment record found for Order ID ${order.id}`);
            // console.log(payments);

            // Optional: Process the payment
             console.log('--- Processing Payment ---');
             const payment = payments[0];
             // Value must match order total. Since we bought 1 product at 2500.00
             const processPayload = {
                 value: 2500.00
             };
             try {
                const procRes = await axios.patch(`${API_URL}/payments/${payment.id}/process`, processPayload);
                console.log(`Payment processed. New Status: ${procRes.data.status}`);
             } catch(e) {
                 console.error('Error processing payment:', e.response?.data || e.message);
             }

        } else {
            console.error(`FAILURE: No payment record found for Order ID ${order.id}. Kafka message might not have been processed.`);
        }
    } catch (e) {
        console.error('Error fetching payments:', e.response?.data || e.message);
    }

    console.log('Seed completed.');

  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
