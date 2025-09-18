// src/routes/clientRoutes.js

const express = require('express');
const router = express.Router();
const {
  createClientController,
  getAllClientsController,
  getClientByIdController,
} = require('../controllers/clientController');

// POST /clients -> Cria um novo cliente
router.post('/', createClientController);

// GET /clients -> Busca todos os clientes
router.get('/', getAllClientsController);

// GET /clients/:id -> Busca um cliente específico pelo ID
router.get('/:id', getClientByIdController);

module.exports = router;