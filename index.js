const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');


// use middleWare 

app.use(cors({
  origin:['http://localhost:5173'],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())


// custom middleware



// mongoDB connection 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vn1kdxv.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {

  try {
    // await client.connect();

  const usersCollection = client.db('rapidParcel').collection('users');
  const parcelCollection = client.db('rapidParcel').collection('parcels');

    // save userInfo 
    app.post('/users', async (req, res) => {
      const userInfo = req.body;

      const isExist = await usersCollection.findOne({ email: userInfo.email});
      if(isExist){
        return res.send({ message: 'Exist'})
      }
      const result = await usersCollection.insertOne(userInfo);
      res.send(result)
    })

    // get a single user info 
    app.get('/users/:email', async (req, res) => {
      const userEmail = req.params.email;
      const result = await usersCollection.findOne({ email: userEmail});
      res.send(result)
    })

    // update single user info 
    app.patch('/users/:email', async (req, res) => {
      const userEmail = req.params.email;
      const changes = req.body;
      const query = { email : userEmail}

      const updatedDoc = {
        $set : {...changes }
      }
      const result = await usersCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // check user role and send 
    app.get('/user-role/:email', async (req, res) => {
      const userEmail = req.params.email;

      const result = await usersCollection.findOne({ email: userEmail});
      res.send({ role: result?.role})
    })

    // insert single booking percel 
    app.post('/booking', async (req, res) => {
      const newParcel = req.body;
      const result = await parcelCollection.insertOne(newParcel);
      res.send(result);
    })

    // get all parcels for admin 
    app.get('/all-parcels', async (req, res) => {
      const result = await parcelCollection.find().toArray();
      res.send(result)
    })

    // get all registered user
    app.get('/all-users', async (req, res) => {
      const skip = parseInt(req.query.skip)
      const limit = parseInt(req.query.limit)

      const totalUsers = await usersCollection.estimatedDocumentCount();
      const result = await usersCollection.find().skip(skip).limit(limit).toArray();
      res.send({ allUsers: result, totalUsers})
    })

    // get all delivery man for admin 
    app.get('/all-delivery-man', async (req, res) => {
      const result = await usersCollection.find({ role: 'delivery-man' }).toArray();
      res.send(result)
    })



    // get all parcels based on the delivery man email 
    app.get('/my-delivery-list/:email', async (req, res) => {
      const userEmail = req.params.email;

      const result = await usersCollection.aggregate([
        {
          $match : { email: userEmail }
        },
        {
          $addFields: {
            convertedId: { $convert: { input: "$_id", to: "string" } },
          }
        },
        {
          $lookup : {
            from : 'parcels',
            localField: 'convertedId',
            foreignField: 'delivery_man_id',
            as : 'my_parcels'
          }
        },
        {
          $project : {
            _id: 0,
            my_parcels: 1
          }
        },
       
      ]).toArray();
      res.send(result)
    })



    // statistics for admin route 
    app.get('/statistics', async (req, res) => {
      const result = await parcelCollection.aggregate([

        {
          $group : {
            _id : '$booking_date',
            totalBooking : { $sum : 1}
          }
        },
        {
          $sort: {
            totalBooking: -1
          }
        },
        {
          $project :{
            _id: 0,
            date: '$_id',
            totalBooking: 1
          }
        }

      ]).toArray()
      
      const bookingByDate = [];
       result.forEach(item => {
        bookingByDate.push([item.date, item.totalBooking])
       })
       bookingByDate.unshift([ 'Date', 'Booking'])
       res.send(bookingByDate)
    })



    // get insights for home page 
    app.get('/insights', async (req, res) => {

      const totalBookedParcels = await parcelCollection.estimatedDocumentCount();
      const totalDeliveredParcels = (await parcelCollection.find({ status : 'delivered'}).toArray()).length;
      const totalUsers = await usersCollection.estimatedDocumentCount();
      res.send({ totalBookedParcels, totalDeliveredParcels, totalUsers})
    })

    // get all parcels based on user email 
    app.get('/my-parcels/:email', async (req, res) => {
      const userEmail = req.params.email;
      const filterStatus = req.query.status;
      const query = { email: userEmail};

      if(filterStatus){
        query.status = filterStatus
      }

      const result = await parcelCollection.find(query).toArray();
      res.send(result)
    })

    // get a single percel data 
    app.get('/parcel/:id', async (req, res) => {
      const parcelId = req.params.id;
      const result = await parcelCollection.findOne({ _id : new ObjectId(parcelId)});
      res.send(result)
    })

    // update a single percel data 
    app.patch('/update/:id', async (req, res) => {
      const parcelId = req.params.id;
      const changes = req.body;
      const query = { _id : new ObjectId(parcelId)}

      const updatedDoc = {
        $set : {
          ...changes
        }
      }
      const result = await parcelCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/health', (req, res) => {
    res.send('Server is running now');
})

app.listen(port, ()=>{
    console.log('Server running on port', port)   
})