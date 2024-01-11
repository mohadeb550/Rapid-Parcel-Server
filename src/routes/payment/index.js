
const router = require('express').Router();
const verifyToken = require('../../middlewares/verifyToken')
const checkSameUser = require('../../middlewares/checkSameUser')

const { createPaymentIntent, savePaymentInfo, getPaymentHistory} = require('../../api/payment/controllers/index')



// create payment intent for user 
router.post('/create-payment-intent', createPaymentIntent )


// save payment history 
router.post('/payments', savePaymentInfo )

// get paymenet history 
router.get('/get-payment-history/:email', verifyToken, checkSameUser,  getPaymentHistory)

module.exports = router;