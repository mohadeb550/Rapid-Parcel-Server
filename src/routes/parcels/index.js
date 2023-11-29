
const router = require('express').Router();
const verifyAdmin = require('../../middlewares/verifyAdmin');
const verifyToken = require('../../middlewares/verifyToken')
const checkSameUser = require('../../middlewares/checkSameUser')
const getAllParcelsAdmin = require('../../api/parcels/controllers/getAllParcelsAdmin')
const getAllParcelDeliveryMan = require('../../api/parcels/controllers/getAllParcelDeliveryMan')
const insertParcel = require('../../api/parcels/controllers/insertParcel')
const getSingleParcel = require('../../api/parcels/controllers/getSingleParcel')
const updateSingleParcel = require('../../api/parcels/controllers/updateSingleParcel')
const getAllParcelUser = require('../../api/parcels/controllers/getAllParcelUser')


   // get a single percel data 
   router.get('/parcel/:id', getSingleParcel)


       // update a single percel data 
    router.patch('/update/:id', updateSingleParcel )

        // get all parcels based on user email 
    router.get('/my-parcels/:email', verifyToken, checkSameUser, getAllParcelUser )


    // get all parcels for admin
router.get('/all-parcels', verifyToken, verifyAdmin,  getAllParcelsAdmin )

    // insert single booking percel 
router.post('/booking', insertParcel )


    // get all parcels based on the delivery man email 
router.get('/my-delivery-list/:email', verifyToken, checkSameUser, getAllParcelDeliveryMan )




module.exports = router;