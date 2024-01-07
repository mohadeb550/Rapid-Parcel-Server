
const router = require('express').Router();
const verifyAdmin = require('../../middlewares/verifyAdmin')
const verifyToken = require('../../middlewares/verifyToken')

const getInsights = require('../../api/statistics/controllers/getInsights')
const getStatistics = require('../../api/statistics/controllers/getStatistics')
const getParcelsAnalytics = require('../../api/statistics/controllers/getParcelsAnalytics')


// get insights for home page 
    router.get('/insights', getInsights )

    // booking by date analytics for admin route 
    router.get('/booking-by-date', verifyToken, verifyAdmin, getStatistics )

    // get parcels analytics for admin 
    router.get('/parcels-analytics', verifyToken, verifyAdmin, getParcelsAnalytics)

module.exports = router;