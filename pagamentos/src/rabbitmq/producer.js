const amqp = require('amqplib');

let channel = null;
let connection = null;

const EXCHANGE_NAME = 'orders';
const EXCHANGE_TYPE = 'topic';
const ROUTING_KEY = 'order.paid';

async function connectProducer() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';
    
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    
    console.log('✓ RabbitMQ Producer conectado com sucesso');
  } catch (error) {
    console.error('✗ Erro ao conectar ao RabbitMQ:', error.message);
    // Retry após 5 segundos
    setTimeout(connectProducer, 5000);
  }
}

async function publishPaymentSuccess(orderId, clientName) {
  try {
    if (!channel) {
      throw new Error('Channel não está inicializado');
    }

    const message = {
      orderId,
      clientName,
      timestamp: new Date().toISOString(),
    };

    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    channel.publish(
      EXCHANGE_NAME,
      ROUTING_KEY,
      messageBuffer,
      { persistent: true }
    );

    console.log(`✓ Evento publicado: Pedido ${orderId} pago para ${clientName}`);
  } catch (error) {
    console.error('✗ Erro ao publicar mensagem:', error.message);
    throw error;
  }
}

async function closeProducer() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('✓ RabbitMQ Producer desconectado');
  } catch (error) {
    console.error('✗ Erro ao desconectar:', error.message);
  }
}

module.exports = {
  connectProducer,
  publishPaymentSuccess,
  closeProducer,
};
