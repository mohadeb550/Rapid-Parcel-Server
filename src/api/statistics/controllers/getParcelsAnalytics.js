
const Parcels = require('../../../models/Parcels');


const getParcelsAnalytics =  async (req, res) => {

    const result = await Parcels.aggregate([

        {
          $group : {
            _id : '$status',
            total : { $sum : 1}
          }
        },
        {
            $project : {
                status: '$_id',
                total: 1,
                _id: 0
            }
        }
      ])
      
      const totalParcels = await Parcels.estimatedDocumentCount();

      const parcelsAnalytics = [];

       result.forEach(item => {
        parcelsAnalytics.push([item.status, item.total])
       })

       parcelsAnalytics.unshift(['Total Parcels', totalParcels])

       parcelsAnalytics.unshift([ 'Parcels Analytics', 'Parcels'])
       res.send(parcelsAnalytics)
  }

  module.exports = getParcelsAnalytics;