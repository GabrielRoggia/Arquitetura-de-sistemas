const amqp = require('amqplib');

let channel = null;
let connection = null;

const EXCHANGE_NAME = 'orders';
const EXCHANGE_TYPE = 'topic';
const ROUTING_KEY = 'order.paid';
const QUEUE_NAME = 'notification.order-paid';

async function connectConsumer() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';
    
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    
    // Declarar exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    
    // Declarar fila
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Fazer binding entre fila e exchange
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
    
    console.log('✓ RabbitMQ Consumer conectado com sucesso');
    
    // Consumir mensagens
    consumeMessages();
  } catch (error) {
    console.error('✗ Erro ao conectar ao RabbitMQ:', error.message);
    // Retry após 5 segundos
    setTimeout(connectConsumer, 5000);
  }
}

async function consumeMessages() {
  try {
    await channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        const { orderId, clientName } = content;
        
        // Simular processamento e log
        console.log(`\n📧 NOTIFICAÇÃO ENVIADA:\n${clientName}, seu pedido foi PAGO com sucesso e será despachado em breve.\n`);
        
        // Confirmar consumo da mensagem
        channel.ack(msg);
      }
    });

    console.log('✓ Aguardando mensagens...');
  } catch (error) {
    console.error('✗ Erro ao consumir mensagens:', error.message);
  }
}

async function closeConsumer() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('✓ RabbitMQ Consumer desconectado');
  } catch (error) {
    console.error('✗ Erro ao desconectar:', error.message);
  }
}

module.exports = {
  connectConsumer,
  closeConsumer,
};
