
const Users = require('../../../models/Users')

const getAllParcelDeliveryMan = async (req, res) => {

    const userEmail = req.params.email;

    const result = await Users.aggregate([
      {
        $match : { email: userEmail }
      },
      {
        $addFields: {
          convertedId: { $convert: { input: "$_id", to: "string" } },
        }
      },
      {
        $lookup : {
          from : 'parcels',
          localField: 'convertedId',
          foreignField: 'delivery_man_id',
          as : 'my_parcels'
        }
      },
      {
        $project : {
          _id: 0,
          my_parcels: 1
        }
      },
     
    ])
    res.send(result)
  }

  module.exports = getAllParcelDeliveryMan;