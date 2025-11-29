const { connectProducer, publishPaymentSuccess, closeProducer } = require("./pagamentos/src/rabbitmq/producer");
const { connectConsumer, closeConsumer } = require("./notificacoes/src/rabbitmq/consumer");

async function testRabbit() {
  console.log("\n🔄 Iniciando teste do RabbitMQ...\n");

  // Inicia o consumer
  await connectConsumer();

  // Aguarda 1 segundo para garantir que o consumer está ouvindo
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Inicia o producer
  await connectProducer();

  console.log("\n📤 Enviando mensagem de teste...\n");

  // Envia uma mensagem de teste
  await publishPaymentSuccess(999, "Teste Automático");

  console.log("\n⏳ Aguardando processamento pelo consumer...\n");

  // Aguarda o consumer processar a mensagem
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("\n✅ Teste concluído!\n");

  await closeProducer();
  await closeConsumer();
}

testRabbit().catch(err => console.error("Erro no teste:", err));
