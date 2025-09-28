const paymentService = require('../models/paymentService'); // Assuming paymentServices.js is renamed to paymentService.js
const { PaymentStatus } = require('@prisma/client'); // Assuming this enum exists in your schema

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Campos obrigatórios: orderId, amount, paymentMethod.' });
    }
    const payment = await paymentService.create({ orderId, amount, paymentMethod });
    res.status(201).json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: 'Não foi possível criar o pagamento.' });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { success } = req.body;

    if (success === undefined) {
      return res.status(400).json({ error: 'Campo "success" (booleano) é obrigatório.' });
    }

    const newStatus = success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    const updatedPayment = await paymentService.process(id, newStatus);
    res.status(200).json(updatedPayment);
  } catch (error) {
    if (error.code === 'P2025') { 
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }
    console.error("Error processing payment:", error);
    res.status(500).json({ error: 'Não foi possível processar o pagamento.' });
  }
};

exports.getPaymentsByOrder = async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) {
      return res.status(400).json({ error: 'O parâmetro de busca "order_id" é obrigatório.' });
    }
    const payments = await paymentService.findByOrderId(order_id);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by order:", error);
    res.status(500).json({ error: 'Não foi possível buscar os pagamentos.' });
  }
};