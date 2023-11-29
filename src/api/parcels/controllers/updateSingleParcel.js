
const Parcels = require('../../../models/Parcels');

const updateSingleParcel = async (req, res) => {
    const parcelId = req.params.id;
    const changes = req.body;
    const query = { _id : parcelId}

    const updatedDoc = {
      $set : {...changes }
    }
    const result = await Parcels.updateOne(query, updatedDoc);
    res.send(result);
  }

  module.exports = updateSingleParcel;