 
 const Users = require('../../../models/Users')

 const getAllUsers =   async (req, res) => {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 5
    

    const totalUsers = await Users.estimatedDocumentCount();

    const result = await Users.aggregate([
      {
        $addFields: {
          users: {$sum : 1},
        }
      },
      {
        $lookup : {
          from : 'parcels',
          localField: 'email',
          foreignField: 'email',
          as : 'my_parcels'}
      },
      {
        $addFields: {
          totalBooking: {$size : '$my_parcels'},
        }
      },
      { 
        $skip: skip 
      },
      {
         $limit: limit 
      }
    ])


    
    res.send({ totalUsers, allUsers : result })
  }

  module.exports = getAllUsers;