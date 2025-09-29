const prisma = require('../prisma.js');

const create = async (paymentData) => {
  return prisma.Payment.create({
    data: paymentData,
  });
};

const process = async (paymentId, newStatus) => {
  return prisma.Payment.update({
    where: { id: paymentId },
    data: {
      status: newStatus,
      processedAt: new Date()
    },
  });
};

const findByOrderId = async (orderId) => {
  return prisma.Payment.findMany({
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