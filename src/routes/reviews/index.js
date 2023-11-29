
const router = require('express').Router();
const getReviews = require('../../api/reviews/controllers/getReviews')
const saveReview = require('../../api/reviews/controllers/saveReview')

   // get reviews based on user email 
router.get('/my-reviews/:email', getReviews)

    // save a user review 
    router.put('/save-review', saveReview )

module.exports = router;