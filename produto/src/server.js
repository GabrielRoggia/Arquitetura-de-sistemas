const express = require("express");
const produtoRoutes = require("./routes/routes.js"); 
const app = express();
const PORT = process.env.PORT || 3002; 

// Limit request body size to 200KB
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ limit: '200kb', extended: true }));

app.use("/api", produtoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Produtos rodando na porta ${PORT}`);
});