
const checkSameUser = (req, res, next ) => {

    const requestedUserEmail = req.params.email;
    const tokenDecodedEmail = req.user.email;
  
    if(requestedUserEmail !== tokenDecodedEmail){
      return res.status(403).send({message : 'Forbidden bad request'})
    }else{
      next();
    }
  }
  
  module.exports = checkSameUser;
  