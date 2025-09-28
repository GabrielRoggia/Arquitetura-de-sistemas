const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (paymentData) => {
  return prisma.payment.create({
    data: paymentData,
  });
};

const process = async (paymentId, newStatus) => {
  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: newStatus,
      processedAt: new Date(),
    },
  });
};

const findByOrderId = async (orderId) => {
  return prisma.payment.findMany({
    where: {
      orderId: orderId,
    },
  });
};

module.exports = {
  create,
  process,
  findByOrderId,
};