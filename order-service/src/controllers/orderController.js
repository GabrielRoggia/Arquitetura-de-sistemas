const orderService = require('../models/orderService');
const Order = require('../models/Order');

exports.create = async (req, res) => {
  try {
    const { clientId, totalValue, orderProducts } = req.body;
    if (!clientId || totalValue === undefined || !orderProducts || !Array.isArray(orderProducts)) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: clientId, totalValue, orderProducts.' });
    }

    // O serviço agora espera 'createOrder'
    const newOrder = await orderService.createOrder({ clientId, totalValue, orderProducts });
    res.status(201).json(newOrder);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Erro de validação.', details: messages });
    }
    console.error("Erro ao criar pedido:", error);
    // Removido 'details' para não expor informações internas
    res.status(500).json({ error: 'Não foi possível criar o pedido.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { client_id } = req.query;
    const orders = await orderService.findAllOrders(client_id);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: 'Não foi possível buscar os pedidos.' });
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.findOrderById(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.status(200).json(order);
  } catch (error) {
    // Trata erros de ID mal formatado (ex: CastError do Mongoose)
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID do pedido em formato inválido.' });
    }
    console.error("Erro ao buscar pedido por ID:", error);
    res.status(500).json({ error: 'Não foi possível buscar o pedido.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validação usando o enum do Mongoose Schema
    const validStatuses = Order.schema.path('status').enumValues;
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.', validStatus: validStatuses });
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado para atualização.' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID do pedido em formato inválido.' });
    }
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ error: 'Não foi possível atualizar o status do pedido.' });
  }
};