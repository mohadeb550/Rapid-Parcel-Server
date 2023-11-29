
const router = require('express').Router();

const { createPaymentIntent, savePaymentInfo} = require('../../api/payment/controllers/index')



// create payment intent for user 
router.post('/create-payment-intent', createPaymentIntent )


// save payment history 
router.post('/payments', savePaymentInfo )

module.exports = router;