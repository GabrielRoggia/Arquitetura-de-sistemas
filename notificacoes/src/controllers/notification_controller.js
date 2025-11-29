const { notificationService } = require('../services/notification_service');

async function notifyOrderPaid(req, res) {
  try {
    const notification = await notificationService.notifyOrderPaid(req.body);
    return res.status(201).json(notification);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { notifyOrderPaid };
