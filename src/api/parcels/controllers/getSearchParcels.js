
const Parcels = require('../../../models/Parcels')

const getSearchParcels = async (req, res) => {

    const userEmail = req.query.email;
    const searchText = req.query.text;


    const result = await Parcels.aggregate([
      {
        $match : { email: userEmail }
      },
   
      {
        $project : {
          parcel_type:1
        }
      },
      {
        $match: {
            parcel_type: { $regex: searchText,  $options: 'i' }
        }
      },
     
    ])
    res.send(result)
  }

  module.exports = getSearchParcels;