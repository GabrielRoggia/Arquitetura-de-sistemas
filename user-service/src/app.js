// src/app.js
const express = require('express');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
app.use(express.json());

// Usando as rotas de clientes sob o prefixo /clients
app.use('/clients', clientRoutes);

module.exports = app;