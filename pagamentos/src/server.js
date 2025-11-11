const express = require("express");
const router = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 3004; 

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Servidor de pagamentos rodando na porta ${PORT}`);
});