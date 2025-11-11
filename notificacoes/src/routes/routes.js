const { Router } = require('express');
const { notifyOrderPaid } = require('../controllers/notification_controller');

const router = Router();

router.post('/notifications/order-paid', notifyOrderPaid);

module.exports = router;
