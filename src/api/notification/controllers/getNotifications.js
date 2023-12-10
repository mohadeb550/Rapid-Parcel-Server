
const Notifications = require('../../../models/Notifications');


const getNotifications = async (req, res) => {
    const userEmail = req.params.email;
    const result = await Notifications.aggregate([
        {
            $match : {
                receiverEmail: userEmail
            }
        }
    ])
    res.send(result);
  }

  module.exports = getNotifications;