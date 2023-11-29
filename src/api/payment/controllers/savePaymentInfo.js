const Payments = require('../../../models/Payments')

const savePaymentInfo = async (req, res) => {
    const payment = req.body;
    const result = await Payments.create(payment);
    res.send(result)
  }

  module.exports = savePaymentInfo;