const { Schema, model} = require('mongoose')

const PaymentSchema = new Schema({
    email : {
        type : String,
        required: true
    },
    price: {
        type : Number,
        required: true
    },
    transactionId : {
        type : String,
        required: true
    },
    date : {
        type : String,
        required: true
    }
})

const Payment = model('Payment', PaymentSchema)
module.exports = Payment;