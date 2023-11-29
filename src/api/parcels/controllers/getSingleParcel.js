
const Parcels = require('../../../models/Parcels');

const getSingleParcel =  async (req, res) => {
    const parcelId = req.params.id;
    const result = await Parcels.findOne({ _id : parcelId});
    res.send(result)
  }

  module.exports = getSingleParcel;