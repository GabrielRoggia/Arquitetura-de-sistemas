const express = require("express");
const router = require("./routes/routes");
const { connectProducer } = require("./kafka/producer");

const app = express();
const PORT = process.env.PORT || 3003; 

// Limit request body size to 200KB
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ limit: '200kb', extended: true }));

app.use("/api", router);

app.listen(PORT, async () => {
  console.log(`Servidor de pedidos rodando na porta ${PORT}`);
  await connectProducer();
});