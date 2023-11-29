
const jwt  = require('jsonwebtoken');
require('dotenv').config()

 const generateJwtToken = async (req, res) => {

    const userEmail = req.body;
    const token = jwt.sign(userEmail, process.env.TOKEN_SECRET, {expiresIn : '1h'})
   res.cookie( 'token', token, { httpOnly: true , secure: true, sameSite:'none'})
   .send({success : true})
  }

  module.exports = generateJwtToken;