
const jwt = require('jsonwebtoken');
require('dotenv').config()



const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
      return res.status(401).send({ message: 'Unauthorized access'})
    }
    if(token){
      jwt.verify(token, process.env.TOKEN_SECRET, (error, decode) => {
        if(error){
          return res.status(401).send({message : 'Unauthorized access'})
        }
        req.user = decode;
        next();
      })
    }
  }

  module.exports = verifyToken;