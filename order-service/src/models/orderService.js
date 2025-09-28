const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (orderData) => {
  const { clientId, totalValue, orderProducts } = orderData;
  return prisma.orders.create({
    data: {
      clientId,
      totalValue,
      orderProducts,
    },
  });
};

const findAll = async (clientId) => {
  const whereCondition = { isDeleted: false };
  if (clientId) {
    whereCondition.clientId = clientId;
  }
  return prisma.orders.findMany({ where: whereCondition });
};

const findById = async (orderId) => {
  return prisma.orders.findUnique({
    where: { id: orderId, isDeleted: false },
  });
};

const updateStatus = async (orderId, status) => {
  return prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });
};

module.exports = {
  create,
  findAll,
  findById,
  updateStatus,
};