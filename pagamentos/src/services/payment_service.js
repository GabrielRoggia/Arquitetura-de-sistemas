const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const paymentService = {
    async createTypePayment({ name }) {
        if (!name) {
            throw new Error('O nome do tipo de pagamento é obrigatório.');
        }

        const existingType = await prisma.typePayment.findFirst({
            where: { name: name }
        });

        if (existingType) {
            throw new Error('Este tipo de pagamento já existe.');
        }

        return prisma.typePayment.create({ data: { name } });
    },

    async getAllTypePayments() {
        return prisma.typePayment.findMany();
    },


    async createPayment(data) {
        console.log('DADOS RECEBIDOS NA CREATE PAYMENT:', data);

        const { orderId, value, typePaymentId } = data;
        if (!orderId || !value || !typePaymentId) {
            throw new Error('orderId, value e typePaymentId são obrigatórios.');
        }

        const paymentType = await prisma.typePayment.findUnique({ where: { id: typePaymentId } });
        if (!paymentType) {
            throw new Error(`Tipo de pagamento com ID ${typePaymentId} não encontrado.`);
        }

        return prisma.orderPayment.create({
            data: {
                orderId,
                value,
                typePaymentId,
                status: 'PENDENTE',
            },
        });
    },

    async findByOrderId(orderId) {
        return prisma.orderPayment.findMany({
            where: { orderId: orderId },
            include: {
                typePayment: { select: { name: true } }
            },
        });
    },

    async processPayment(paymentId, data) {
        const { value } = data;
        if (value === undefined) {
            throw new Error('O campo "value" é obrigatório no corpo da requisição.');
        }

        const payment = await prisma.orderPayment.findUnique({ where: { id: paymentId } });

        if (!payment) throw new Error(`Pagamento com ID ${paymentId} não encontrado.`);
        if (payment.status !== 'PENDENTE') throw new Error(`Este pagamento já foi processado. Status: ${payment.status}`);

        if (value !== parseFloat(payment.value)) {
            throw new Error(`O valor informado não corresponde ao valor do pedido.`);
        }

        const isSuccess = Math.random() > 0.2;
        const newStatus = isSuccess ? 'APROVADO' : 'RECUSADO';

        const updatedPayment = await prisma.orderPayment.update({
            where: { id: paymentId },
            data: { status: newStatus },
        });

        const orderStatus = isSuccess ? 'PAGO' : 'CANCELADO';
        try {
            await axios.patch(`http://pedidos-service:3003/api/orders/${payment.orderId}/status`, {
                status: orderStatus,
            });
        } catch (error) {
            console.error(`Falha ao atualizar o status do pedido ${payment.orderId}:`, error.message);
        }

        if (isSuccess) {
            try {
                const orderResponse = await axios.get(`http://pedidos-service:3003/api/orders/${payment.orderId}`);
                const orderData = orderResponse.data || {};

                await axios.post('http://notificacoes-service:3005/api/notifications/order-paid', {
                    orderId: payment.orderId,
                    userId: orderData.userId,
                    totalValue: orderData.totalValue,
                });
            } catch (notificationError) {
                console.warn(`Não foi possível enviar a notificação do pedido ${payment.orderId}: ${notificationError.message}`);
            }
        }

        return updatedPayment;
    },
};

module.exports = { paymentService };
