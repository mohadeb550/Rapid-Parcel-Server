const express = require('express');

const applyMiddleware = require('./middlewares/applyMiddleware')
const app = express();
require('dotenv').config()

// socket connection 

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });


global.io = io;



 const authRoutes =  require('../src/routes/authentication/index');
 const paymentRoutes = require('./routes/payment/index')
 const parcelsRoutes = require('./routes/parcels/index')
 const usersRoutes = require('./routes/users/index')
 const statisticsRoutes = require('./routes/statistics/index')
 const reviewsRoutes = require('./routes/reviews/index')
 const notificationRoutes = require('./routes/notification/index')




applyMiddleware(app);

// use routes 

app.use(authRoutes)
app.use(paymentRoutes)
app.use(parcelsRoutes)
app.use(usersRoutes)
app.use(statisticsRoutes)
app.use(reviewsRoutes)
app.use(notificationRoutes)






app.get('/health', (req, res) => {
    res.send('Server is running now');
})

app.all('*',(req, res, next ) => {
    const error = new Error(`The Requested url is not found: ${req.url}`)
    error.status = 404
    next(error)
})

app.use((err, req, res, next)=> {
    res.status(err.status || 500 ).send({ message : err.message })
})


// const main =  async () => {
//    await connectDB();

//    app.listen(port, ()=>{
//     console.log('Server running on port', port)   
// })
// }

// main();

// module.exports = app;
module.exports = server;