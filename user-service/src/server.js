// src/server.js

// 1. Carrega as variáveis de ambiente do arquivo .env
// É importante que seja a primeira linha para garantir que process.env seja populado.
require('dotenv').config();

// 2. Importa a aplicação Express configurada do arquivo app.js
const app = require('./app');

// 3. Define a porta onde o servidor irá rodar
// Ele vai tentar usar a porta definida no .env, mas se não houver, usará a 3001.
const PORT = process.env.PORT || 3000;

// 4. Inicia o servidor
app.listen(PORT, () => {
  console.log(`User microservice is running on port ${PORT}`);
  console.log(`Access it at http://localhost:${PORT}`);
});