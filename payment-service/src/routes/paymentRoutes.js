const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /payments (Cria um registro de pagamento)
router.post('/', paymentController.createPayment);

// PATCH /payments/:id/process (Processa um pagamento)
router.patch('/:id/process', paymentController.processPayment);

// GET /payments?order_id=... (Busca pagamentos por ID do pedido)
router.get('/', paymentController.getPaymentsByOrder);

module.exports = router;