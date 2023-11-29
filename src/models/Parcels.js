const { Schema, model} = require('mongoose')

const ParcelSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    phone : {
        type : String,
        required: true
    },
    parcel_type : {
        type : String,
        required: true
    },
    weight : {
        type : String,
        required: true
    },
    product_img : {
        type : String,
        required: true
    },
    receiver_name : {
        type : String,
        required: true
    },
    receiver_phone : {
        type : String,
        required: true
    },
    delivery_address : {
        type : String,
        required: true
    },
    req_date : {
        type : String,
        required: true
    },
    booking_date : {
        type : String,
        required: true
    },
    address_lat : {
        type : String,
        required: true
    },
    address_long : {
        type : String,
        required: true
    },
    cost : {
        type : Number,
        required: true
    },
    payment : {
        type : String,
        required: true
    },
    status : {
        type : String,
        required: true
    },
    delivery_man_id : {
        type : String,
    },
    approx_date : {
        type : String,
    }
})

const Parcels = model('Parcels', ParcelSchema)
module.exports = Parcels;