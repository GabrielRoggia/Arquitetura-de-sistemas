const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota para criar um novo pedido
router.post('/', orderController.create);

// Rota para buscar todos os pedidos (com filtro opcional por cliente)
router.get('/', orderController.findAll);

// Rota para buscar um pedido por ID
router.get('/:id', orderController.findById);

// Rota para atualizar o status de um pedido
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;