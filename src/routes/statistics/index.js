
const router = require('express').Router();
const verifyAdmin = require('../../middlewares/verifyAdmin')
const verifyToken = require('../../middlewares/verifyToken')

const getInsights = require('../../api/statistics/controllers/getInsights')
const getStatistics = require('../../api/statistics/controllers/getStatistics')


// get insights for home page 
    router.get('/insights', getInsights )

    // statistics for admin route 
    router.get('/statistics', verifyToken, verifyAdmin, getStatistics )

module.exports = router;