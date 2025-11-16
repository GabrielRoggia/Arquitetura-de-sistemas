const express = require("express");
const router = require("./routes/routes");
const { connectProducer, closeProducer } = require("./rabbitmq/producer");

const app = express();
const PORT = process.env.PORT || 3004; 

app.use(express.json());

app.use("/api", router);

const server = app.listen(PORT, async () => {
  console.log(`Servidor de pagamentos rodando na porta ${PORT}`);
  
  // Conectar ao RabbitMQ
  await connectProducer();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\nSIGTERM recebido, encerrando...');
  server.close(() => {
    closeProducer();
    process.exit(0);
  });
});
