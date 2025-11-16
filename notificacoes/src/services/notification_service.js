const axios = require('axios');

const notificationService = {
  async notifyOrderPaid(data) {
    const { orderId, userId, totalValue } = data;

    if (!orderId) {
      throw new Error('orderId é obrigatório.');
    }

    let user = null;
    if (userId) {
      try {
        const response = await axios.get(`http://cliente-service:3001/api/clients/${userId}`);
        user = response.data;
      } catch (error) {
        console.warn(`Não foi possível obter os dados do usuário ${userId}: ${error.message}`);
      }
    }

    const notificationPayload = {
      orderId,
      userId: userId || user?.id || null,
      totalValue: totalValue ?? null,
      deliveredAt: new Date().toISOString(),
      channel: 'EMAIL',
      status: 'SENT',
      message: user
        ? `Olá ${user.name}, o pagamento do pedido ${orderId} foi confirmado.`
        : `Pedido ${orderId} confirmado e notificação enviada.`,
    };

    console.log('Notificação enviada:', notificationPayload);
    return notificationPayload;
  },
};

module.exports = { notificationService };
