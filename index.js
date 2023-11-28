const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


// use middleWare 

app.use(cors({
  origin:['http://localhost:5174'],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())


// custom middleware
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

const checkSameUser = (req, res, next ) => {
  const requestedUserEmail = req.params.email;
  const tokenDecodedEmail = req.user.email;

  if(requestedUserEmail !== tokenDecodedEmail){
    return res.status(403).send({message : 'Forbidden bad request'})
  }else{
    next();
  }
}



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
  const reviewCollection = client.db('rapidParcel').collection('reviews');
  const paymentCollection = client.db('rapidParcel').collection('payments');


    // payment related api 
    // payment intent 
    app.post('/create-payment-intent', async (req,res)=> {
      const { totalPrice , currency } = req.body;
      const totalAmount = parseInt( totalPrice * 100)

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency,
      })
      const clientSecret = paymentIntent.client_secret;
      res.send(clientSecret)
    })


    // save payment history 
    app.post('/payments', async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result)
    })

// mohadebMapGL$0
  
 // generate jwt token for user
 app.post('/jwt', async (req, res) => {

  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.TOKEN_SECRET, {expiresIn : '1h'})
 res.cookie( 'token', token, { httpOnly: true , secure: true, sameSite:'none'})
 .send({success : true})
})

// clear client side cookie
app.get('/logout', async (req, res) => {
  res.clearCookie('token', {maxAge: '0'})
  .send({success : true})
})

    // verify admin middleware
    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const userTokenEmail = req.user.email;
      const query = { email : userTokenEmail};
      const user = await usersCollection.findOne(query);
      const isAdmin = user.role === 'admin';
      if(!isAdmin){
        return res.status(403).send( {message: 'Forbidden'})
      }else{
        next();
      }
    }
    


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

    // update totalDelivered parcel for delivery man 
    app.patch('/update-total-delivered/:email', async (req, res ) => {
      const deliveryManEmail = req.params.email;
      const userInfo = await usersCollection.findOne({ email: deliveryManEmail});
      console.log(userInfo)
      if(userInfo.total_delivered){
        const totalDelivery = parseInt(userInfo.total_delivered) + 1 ;
        const updateDoc = { $set : { total_delivered : totalDelivery}}
        const result  = await usersCollection.updateOne({ email : deliveryManEmail},updateDoc)
        res.send(result);
      }
      else{
        const updateDoc = { $set : { total_delivered: 1}};
        const result  = await usersCollection.updateOne({ email: deliveryManEmail}, updateDoc);
        res.send(result);
      }
    })

    // check user role and send 
    app.get('/user-role/:email', verifyToken,  async (req, res) => {
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
    app.get('/all-parcels', verifyToken, verifyAdmin,   async (req, res) => {
      const startDateString = req.query.start;
      const endDateString = req.query.end;

    const startDateObj = new Date(startDateString);
    const endDateObj = new Date(endDateString);

  const result = await parcelCollection.aggregate([
  {
    $addFields: {
      // Convert the req_date field to a Date object
      converted_req_date: {
        $toDate: "$req_date"
      }
    }
  },
  {
    $match: {
      converted_req_date: {
        $gte: startDateObj,
        $lte: endDateObj
      }
    }
  },
  {
    $sort: {
      converted_req_date: -1 
    }
  }
]).toArray();

      res.send(result)
    })

    // get all registered user
    app.get('/all-users', verifyToken, verifyAdmin,   async (req, res) => {
      const skip = parseInt(req.query.skip) || 0
      const limit = parseInt(req.query.limit) || 5

      const totalUsers = await usersCollection.estimatedDocumentCount();
      // const result = await usersCollection.find().skip(skip).limit(limit).toArray();

      const result = await usersCollection.aggregate([
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
      ]).toArray();


      
      res.send({ totalUsers, allUsers : result })
    })

    // get all delivery man for admin / use top 5 delivery man section
    app.get('/all-delivery-man',  async (req, res) => {


      const result = await usersCollection.aggregate([
        {
          $match : { 
            role : 'delivery-man'
          }
        },
        {
          $addFields: {
            convertedId: { $convert: { input: "$_id", to: "string" } },
          }
        },
        {
          $lookup : {
            from : 'reviews',
            localField: 'convertedId',
            foreignField: 'deliveryManId',
            as : 'my_review'
          }
        },
        {
          $unwind : '$my_review'
        },
        {
          $group : {
            _id : '$_id',
            name: { $first: "$name" },
            email: {$first: '$email'},
            image: {$first: '$image'},
            phone: {$first: '$phone'},
            total_delivered : {$first: '$total_delivered'},
            totalReviews: {$sum : 1},
            avg_review : {$avg : '$my_review.rating'}
          }
        },
        {
          $sort: {
            total_delivered: -1,
            avg_review: -1
          }
        }
        
      ]).toArray();
      res.send(result)
    })
 
  


    // get all parcels based on the delivery man email 
    app.get('/my-delivery-list/:email', verifyToken, checkSameUser,  async (req, res) => {
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
    app.get('/statistics', verifyToken, verifyAdmin,  async (req, res) => {
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
    app.get('/my-parcels/:email', verifyToken, checkSameUser,  async (req, res) => {
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
        $set : {...changes }
      }
      const result = await parcelCollection.updateOne(query, updatedDoc);
      res.send(result);
    })

    // save a user review 
    app.put('/save-review', async (req, res) => {
      const newReview = req.body;
      
      const updatedDoc = {
        $set : {...newReview}
      }
      const options = { upsert: true}
      const result = await reviewCollection.updateOne({ deliveryManId: newReview.deliveryManId ,  email: newReview.email}, updatedDoc, options)
      res.send(result)
    })

    // get reviews based on user email 
    app.get('/my-reviews/:email', async (req, res) => {
      const userEmail = req.params.email;
      const result = await usersCollection.aggregate([
        {
          $match : {
            email: userEmail
          }
        },
        {
          $addFields: {
            convertedId: { $convert: { input: "$_id", to: "string" } },
          }
        },
        {
          $lookup : {
            from : 'reviews',
            localField: 'convertedId',
            foreignField: 'deliveryManId',
            as : 'my_reviews'
          }
        },
        {
          $project :{
            _id: 0,
            my_reviews: 1
          }
        }
      ]).toArray()
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