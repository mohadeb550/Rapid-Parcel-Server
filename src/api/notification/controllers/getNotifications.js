
const Notifications = require('../../../models/Notifications');


const getNotifications = async (req, res) => {
    const userEmail = req.params.email;
    const result = await Notifications.aggregate([
        {
            $match : {
                receiverEmail: userEmail
            }
        },
        {
            $addFields: {
              // Convert the string date field to a Date object
              converted_date: {
                $toDate: "$date"
              }
            }
        },
        {
            $sort: {
              converted_date: -1 
            }
        }
    ])
    res.send(result);
  }

  module.exports = getNotifications;