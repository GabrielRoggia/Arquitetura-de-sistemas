const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderProducts: [OrderProductSchema],
  status: {
    type: String,
    enum: ['AGUARDANDO_PAGAMENTO', 'FALHA_NO_PAGAMENTO', 'PAGO', 'CANCELADO'],
    default: 'AGUARDANDO_PAGAMENTO',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
