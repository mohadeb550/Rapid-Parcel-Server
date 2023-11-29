
// const Users = require('../../../models/Users')
const Users = require('../../../models/Users')

const saveUserInfo = async (req, res, next) => {
    const userInfo = req.body;

    try{
        const isExist = await Users.findOne({ email: userInfo.email});
        if(isExist){
          return res.send({ message: 'Exist'})
        }
        const result = await Users.create(userInfo);
        res.send(result)

    }catch(error){
        next(error)
    }
}

module.exports = saveUserInfo;