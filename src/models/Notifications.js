const { Schema, model} = require('mongoose')

const NotificationsSchema = new Schema({
    receiverEmail : {
        type : String,
        required: true
    },
    title: {
        type : String,
        required: true
    },
    date : {
        type : String,
        required: true
    },
    isRead : {
        type : Boolean,
        required: true
    },
    parcelName : {
        type : String,
        required: true,
    }
})

const Notifications = model('Notifications', NotificationsSchema)
module.exports = Notifications;