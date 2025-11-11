const { paymentService } = require('../services/payment_service.js');

async function createTypePayment(req, res) {
    try {
        const typePayment = await paymentService.createTypePayment(req.body);
        res.status(201).json(typePayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllTypePayments(req, res) {
    try {
        const typePayments = await paymentService.getAllTypePayments();
        res.status(200).json(typePayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createPayment(req, res) {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function processPayment(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        const payment = await paymentService.processPayment(id, data);
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getPaymentsByOrderId(req, res) {
    try {
        const { orderId } = req.params;
        const payments = await paymentService.findByOrderId(orderId);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createTypePayment,
    getAllTypePayments,
    createPayment,
    processPayment,
    getPaymentsByOrderId
};