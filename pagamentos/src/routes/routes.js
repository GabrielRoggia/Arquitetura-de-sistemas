const { Router } = require('express');
const { 
  createTypePayment,
  getAllTypePayments,
  createPayment,
  processPayment,
  getPaymentsByOrderId 
} = require('../controllers/payment_controller.js');

const router = Router();

router.post('/type-payments', createTypePayment);
router.get('/type-payments', getAllTypePayments);

router.post('/payments', createPayment);
router.patch('/payments/:id/process', processPayment);
router.get('/payments/order/:orderId', getPaymentsByOrderId);

module.exports = router;