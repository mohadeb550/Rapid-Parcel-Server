
const Users = require('../../../models/Users')


 const getReviews = async (req, res) => {
    const userEmail = req.params.email;
    const result = await Users.aggregate([
      {
        $match : {
          email: userEmail
        }
      },
      {
        $addFields: {
          convertedId: { $convert: { input: "$_id", to: "string" } },
        }
      },
      {
        $lookup : {
          from : 'reviews',
          localField: 'convertedId',
          foreignField: 'deliveryManId',
          as : 'my_reviews'
        }
      },
      {
        $project :{
          _id: 0,
          my_reviews: 1
        }
      }
    ])
    res.send(result)
  }

  module.exports = getReviews;