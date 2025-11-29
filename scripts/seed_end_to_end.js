const axios = require('axios');

// Configurações
const CLIENTE_API = 'http://localhost:3001/api';
const PRODUTO_API = 'http://localhost:3002/api';
const PEDIDOS_API = 'http://localhost:3003/api';
const PAGAMENTOS_API = 'http://localhost:3004/api';

async function seed() {
  console.log('Starting End-to-End Seed...');

  try {
    // 1. Create User (Cliente Service)
    console.log('--- Creating User ---');
    const userPayload = {
      name: 'John Doe',
      email: `johndoe${Date.now()}@example.com`,
      password: 'password123',
      cpf: `123456789${Math.floor(Math.random() * 100)}` // Simple random CPF
    };
    
    // Check if user exists or create new. Since we use random email, we create new.
    // Routes in cliente/src/routes/cliente_routes.js are /clients
    let user;
    try {
        const userRes = await axios.post(`${CLIENTE_API}/clients`, userPayload);
        user = userRes.data;
        console.log(`User created with ID: ${user.id}`);
    } catch (e) {
        console.error('Error creating user:', e.response?.data || e.message);
        // Try to fetch an existing user if creation fails (maybe CPF dup)
        // But for now, let's assume it works or we just stop.
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
        const prodRes = await axios.post(`${PRODUTO_API}/products`, productPayload);
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
        const payTypeRes = await axios.post(`${PAGAMENTOS_API}/type-payments`, paymentTypePayload);
        paymentType = payTypeRes.data;
        console.log(`Payment Type created with ID: ${paymentType.id}`);
    } catch (e) {
         console.error('Error creating payment type:', e.response?.data || e.message);
         // Might fail if name exists, try to fetch all and pick one
         const allTypes = await axios.get(`${PAGAMENTOS_API}/type-payments`);
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
        const orderRes = await axios.post(`${PEDIDOS_API}/orders`, orderPayload);
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
        const paymentsRes = await axios.get(`${PAGAMENTOS_API}/payments/order/${order.id}`);
        const payments = paymentsRes.data;
        if (payments.length > 0) {
            console.log(`SUCCESS: Payment record found for Order ID ${order.id}`);
            console.log(payments);
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
