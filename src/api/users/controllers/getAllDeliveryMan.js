
const Users = require('../../../models/Users')


const getAllDeliveryMan = async (req, res) => {


    const result = await Users.aggregate([
      {
        $match : { 
          role : 'delivery-man'
        }
      },
      {
        $addFields: {
          convertedId: { $convert: { input: "$_id", to: "string" }},
        }
      },
      {
        $lookup : {
          from : 'reviews',
          localField: 'convertedId',
          foreignField: 'deliveryManId',
          as : 'my_review'
        }
      },
      {
        $addFields: {
          totalReviews: { $size: "$my_review" },
        }
      },
      {
        $unwind: {
          path: "$my_review",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group : {
          _id : '$_id',
          name: { $first: "$name" },
          email: {$first: '$email'},
          image: {$first: '$image'},
          phone: {$first: '$phone'},
          total_delivered : {$first: { $toInt: "$total_delivered" }},
          totalReviews: {$first: '$totalReviews'},
          avg_review_float : {$avg : '$my_review.rating'}
        }
      },
      {
        $sort: {
          total_delivered: -1,
          avg_review_float: -1
        }
      },
      {
        $addFields: {
          avg_review: { $round: ["$avg_review_float", 1]  }
        }
      }
    ])
    res.send(result)
  }

  module.exports = getAllDeliveryMan;