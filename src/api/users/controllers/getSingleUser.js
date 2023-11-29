
const Users = require('../../../models/Users')


const getSingleUser =  async (req, res) => {
    const userEmail = req.params.email;
    const result = await Users.findOne({ email: userEmail});
    res.send(result)
  }

  module.exports = getSingleUser;