
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const createPaymentIntent = async (req,res)=> {

    const { totalPrice , currency } = req.body;
    const totalAmount = parseInt( totalPrice * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
    })
    const clientSecret = paymentIntent.client_secret;
    res.send(clientSecret)
  }

  module.exports = createPaymentIntent;