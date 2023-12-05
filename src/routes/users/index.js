
const router = require('express').Router();
const getUserRole = require('../../api/users/controllers/getUserRole')
const saveUserInfo = require('../../api/users/controllers/saveUserInfo')
const getSingleUser = require('../../api/users/controllers/getSingleUser')
const getAllUsers = require('../../api/users/controllers/getAllUsers')
const updateUserInfo = require('../../api/users/controllers/updateUserInfo')
const getTopDeliveryMan = require('../../api/users/controllers/getTopDeliveryMan')
const getAllDeliveryMan = require('../../api/users/controllers/getAllDeliveryMan')
const updateTotalDelivery = require('../../api/users/controllers/updateTotalDelivery')
const verifyToken = require('../../middlewares/verifyToken')
const verifyAdmin = require('../../middlewares/verifyAdmin')



    // check user role and send 
router.get('/user-role/:email', verifyToken, getUserRole )


// save user info in database 
router.post('/users', saveUserInfo )

// get a single user info 
router.get('/users/:email', getSingleUser)


 // update single user info 
 router.patch('/users/:email', updateUserInfo )


    // get all registered user
router.get('/all-users', verifyToken, verifyAdmin, getAllUsers )


    // get all delivery man for admin / use top 5 delivery man section
 router.get('/top-delivery-man', getTopDeliveryMan  )

 router.get('/all-delivery-man', getAllDeliveryMan  )

 
    // update totalDelivered parcel for delivery man

    router.patch('/update-total-delivered/:email', updateTotalDelivery )

 


module.exports = router;