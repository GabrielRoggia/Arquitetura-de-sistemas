const express = require("express");
const produtoRoutes = require("./routes/routes.js"); 
const app = express();
const PORT = process.env.PORT || 3002; 

app.use(express.json());

app.use("/api", produtoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Produtos rodando na porta ${PORT}`);
});