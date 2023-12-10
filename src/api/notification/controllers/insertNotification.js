

const Notifications = require('../../../models/Notifications');


const insertNotification = async (req, res) => {
    const newNotification = req.body;
    const result = await Notifications.create(newNotification);
    res.send(result);
  }

  module.exports = insertNotification;