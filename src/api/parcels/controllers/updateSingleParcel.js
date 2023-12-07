
const Parcels = require('../../../models/Parcels');
const sendMail = require('../../../utils/sendMail');

const updateSingleParcel = async (req, res) => {
    const parcelId = req.params.id;
    const changes = req.body;
    const status = req.query.status;
    const query = { _id : parcelId}

    const updatedDoc = {
      $set : {...changes }
    }
    const result = await Parcels.updateOne(query, updatedDoc);
    res.send(result);
    
    if(status === 'makedelivered'){
      const parcel = await Parcels.findOne(query);
     sendMail(parcel.email, parcel.parcel_type)
    }
  }

  module.exports = updateSingleParcel;