const router = require('express').Router();

const insertNotification = require('../../api/notification/controllers/insertNotification')
const getNotifications = require('../../api/notification/controllers/getNotifications')



// insert a new notification 
router.post('/insert-notification', insertNotification )

// get last 7 notifications 
router.get('/get-notifications/:email', getNotifications )


module.exports = router;