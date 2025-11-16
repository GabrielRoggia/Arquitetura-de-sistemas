const express = require('express');
const router = require('./routes/routes');
const { connectConsumer, closeConsumer } = require('./rabbitmq/consumer');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/api', router);

const server = app.listen(PORT, async () => {
  console.log(`Serviço de notificações rodando na porta ${PORT}`);
  
  // Conectar ao RabbitMQ e começar a consumir mensagens
  await connectConsumer();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\nSIGTERM recebido, encerrando...');
  server.close(() => {
    closeConsumer();
    process.exit(0);
  });
});
