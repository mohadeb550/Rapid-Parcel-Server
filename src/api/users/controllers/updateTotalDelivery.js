
const Users = require('../../../models/Users')

const updateTotalDelivery = async (req, res ) => {
    const deliveryManEmail = req.params.email;
    const userInfo = await Users.findOne({ email: deliveryManEmail});

    if(userInfo.total_delivered){
      const totalDelivery = parseInt(userInfo.total_delivered) + 1 ;
      const updateDoc = { $set : { total_delivered : totalDelivery}}
      const result  = await Users.updateOne({ email : deliveryManEmail},updateDoc)
      res.send(result);
    }
    else{
      const updateDoc = { $set : { total_delivered: 1}};
      const result  = await Users.updateOne({ email: deliveryManEmail}, updateDoc);
      res.send(result);
    }
  }

  module.exports = updateTotalDelivery;