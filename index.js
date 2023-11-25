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
      const userEmail = req.params.id;
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

    // get all delivery man for admin 
    app.get('/all-delivery-man', async (req, res) => {
      const result = await usersCollection.find({ role: 'delivery-man' }).toArray();
      res.send(result)
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