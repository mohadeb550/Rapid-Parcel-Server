
const reviews = require('../../../models/Reviews')

const saveReview = async (req, res) => {

    const newReview = req.body;

    const updatedDoc = {
      $set : {...newReview}
    }
    const options = { upsert: true}
    const result = await reviews.updateOne({ deliveryManId: newReview.deliveryManId ,  email: newReview.email}, updatedDoc, options)
    res.send(result)
  }

  module.exports = saveReview;