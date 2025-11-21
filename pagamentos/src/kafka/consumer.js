const { Kafka } = require('kafkajs');
const { paymentService } = require('../services/payment_service');

const kafka = new Kafka({
  clientId: 'pagamentos-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
});

const consumer = kafka.consumer({ groupId: 'pagamentos-group' });

async function connectConsumer(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await consumer.connect();
      console.log('Kafka Consumer connected');

      await consumer.subscribe({ topic: 'order-created', fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          console.log(`Received message on ${topic}: ${value}`);
          try {
            const paymentData = JSON.parse(value);
            await paymentService.createPayment(paymentData);
            console.log(`Payment created for Order ID: ${paymentData.orderId}`);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
      });
      return;
    } catch (error) {
      console.error(`Error connecting Kafka Consumer (attempt ${i + 1}/${retries}):`, error.message);
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
  console.error('Failed to connect to Kafka Consumer after multiple attempts.');
}

module.exports = { connectConsumer };
