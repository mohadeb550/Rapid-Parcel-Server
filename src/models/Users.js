const { Schema, model} = require('mongoose')

const UsersSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    image : {
        type : String,
    },
    role : {
        type : String,
        required: true
    },
    address : {
        type : String,
    },
    phone : {
        type : String,
    },
    total_delivered : {
        type : String,
    }
})

const Users = model('Users', UsersSchema)
module.exports = Users;