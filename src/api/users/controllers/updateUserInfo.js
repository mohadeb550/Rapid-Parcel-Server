

const Users = require('../../../models/Users')


const updateUserInfo =  async (req, res) => {
    const userEmail = req.params.email;
    const changes = req.body;
    const query = { email : userEmail}

    const updatedDoc = {
      $set : {...changes }
    }
    const result = await Users.updateOne(query, updatedDoc);
    res.send(result);
  }

  module.exports = updateUserInfo;