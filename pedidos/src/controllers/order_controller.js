const { orderService } = require("../services/order_service.js");

async function createOrder(req, res) {
  try {
    const order = await orderService.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getOrders(req, res) {
  try {
    const { userID } = req.query;
    if (userID) {
      const orders = await orderService.findByUserId(userID);
      return res.json(orders);
    }
    return res.status(400).json({ message: 'userID query parameter is required' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await orderService.updateStatus(req.params.id, status);
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};