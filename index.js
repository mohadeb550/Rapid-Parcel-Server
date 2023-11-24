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