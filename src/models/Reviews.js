const { Schema, model} = require('mongoose')

const ReviewSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    deliveryManId : {
        type: String,
        required: true
    },
    feedback_description : {
        type: String,
    },
    feedback_title : {
        type: String,
    },
    image : {
        type : String,
    },
    rating : {
        type : Number,
    },
    review_date : {
        type : String,
        required: true
    }
})

const Reviews = model('Reviews', ReviewSchema)
module.exports = Reviews;