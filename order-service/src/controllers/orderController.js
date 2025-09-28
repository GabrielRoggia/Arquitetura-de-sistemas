const orderService = require('../models/orderService');
const { OrderStatus } = require('@prisma/client');

exports.createOrder = async (req, res) => {
  try {
    const { clientId, totalValue, orderProducts } = req.body;
    if (!clientId || totalValue === undefined || !orderProducts) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: clientId, totalValue, orderProducts.' });
    }

    const newOrder = await orderService.create({ clientId, totalValue, orderProducts });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: 'Não foi possível criar o pedido.', details: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { client_id } = req.query;
    const orders = await orderService.findAll(client_id);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: 'Não foi possível buscar os pedidos.', details: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    res.status(500).json({ error: 'Não foi possível buscar o pedido.', details: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: 'Status inválido.', validStatus: Object.values(OrderStatus) });
    }

    const updatedOrder = await orderService.updateStatus(id, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Pedido não encontrado para atualização.' });
    }
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ error: 'Não foi possível atualizar o status do pedido.', details: error.message });
  }
};