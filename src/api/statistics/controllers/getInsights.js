
const Parcels = require('../../../models/Parcels');
const Users = require('../../../models/Users')


const getInsights =  async (req, res) => {

    const totalBookedParcels = await Parcels.estimatedDocumentCount();
    const totalDeliveredParcels = await Parcels.find({ status : 'delivered'})
    const totalUsers = await Users.estimatedDocumentCount();
    res.send({ totalBookedParcels, totalDeliveredParcels: totalDeliveredParcels.length, totalUsers})
  }

  module.exports = getInsights;