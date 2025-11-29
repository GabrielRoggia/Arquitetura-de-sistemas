const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pedidos-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
});

const producer = kafka.producer();

async function connectProducer(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log('Kafka Producer connected');
      return;
    } catch (error) {
      console.error(`Error connecting Kafka Producer (attempt ${i + 1}/${retries}):`, error.message);
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
  console.error('Failed to connect to Kafka Producer after multiple attempts.');
}

async function sendMessage(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    console.log(`Message sent to topic ${topic}`);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
    throw error;
  }
}

module.exports = { connectProducer, sendMessage, producer };
