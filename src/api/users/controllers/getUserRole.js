
const Users = require('../../../models/Users')

const getUserRole =  async (req, res) => {
    const userEmail = req.params.email;

    const result = await Users.findOne({ email: userEmail});
    res.send({ role: result?.role})
  }

  module.exports = getUserRole;