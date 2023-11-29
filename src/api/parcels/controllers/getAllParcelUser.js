
const Parcels = require('../../../models/Parcels');

const getAllParcelUser = async (req, res) => {

    const userEmail = req.params.email;
    const filterStatus = req.query.status;
    const query = { email: userEmail};

    if(filterStatus){
      query.status = filterStatus
    }

    const result = await Parcels.find(query);
    res.send(result)
  }

  module.exports = getAllParcelUser;