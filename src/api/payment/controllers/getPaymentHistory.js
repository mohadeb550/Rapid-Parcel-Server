const Payments = require('../../../models/Payments')


const getPaymentHistory = async (req, res) => {
    const userEmail = req.params.email;

    const result = await Payments.aggregate([
        {
            $match : { email : userEmail}
        },
        {
            $addFields: {
              converted_object_id: {
                $convert: { input: "$parcelId",  to: "objectId" }
              }
            }
          },
        {
            $lookup : {
              from : 'parcels',
              localField: 'converted_object_id',
              foreignField: '_id',
              as : 'parcelInfo'
            }
         },
         {
            $unwind : '$parcelInfo'
         },
         {
            $project : {
                email : 1,
                price: 1,
                transactionId: 1,
                date: 1,
                'parcelInfo.parcel_type' : 1,
                'parcelInfo.product_img' : 1
            }
         }
    ])
    res.send(result)
  }

  module.exports = getPaymentHistory;