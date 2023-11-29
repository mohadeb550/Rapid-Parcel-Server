
const Users = require('../models/Users')

    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
        const userTokenEmail = req.user.email;
        const query = { email : userTokenEmail};
        const user = await Users.findOne(query);
        const isAdmin = user.role === 'admin';
        if(!isAdmin){
          return res.status(403).send( {message: 'Forbidden'})
        }else{
          next();
        }
      }
      
    module.exports = verifyAdmin;