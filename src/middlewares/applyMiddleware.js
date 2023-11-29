
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { LOCAL_CLIENT} = require('../config/default')

const applyMiddleware = (app) => {
    // use middleWare 

app.use(cors({
    origin:[ LOCAL_CLIENT],
    credentials: true
  }));
  app.use(express.json())
  app.use(cookieParser())
  
}

module.exports = applyMiddleware;