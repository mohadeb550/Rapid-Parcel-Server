
const Parcels = require('../../../models/Parcels');


const insertParcel = async (req, res) => {
    const newParcel = req.body;
    const result = await Parcels.create(newParcel);
    res.send(result);
  }

  module.exports = insertParcel;