const Order = require('./Order');

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const findOrderById = async (id) => {
  return await Order.findById(id);
};

const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

const findAllOrders = async (clientId) => {
  const query = { isDeleted: false };
  if (clientId) {
    query.clientId = clientId;
  }
  return await Order.find(query);
};

module.exports = {
  createOrder,
  findOrderById,
  updateOrderStatus,
  findAllOrders,
};
