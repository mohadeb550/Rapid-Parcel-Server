const { default: mongoose } = require('mongoose');

require('dotenv').config()

const getConnectionString =  () => {
    let connectionURI;

    if(process.env.NODE_ENV === 'development'){
        connectionURI = process.env.DATABASE_LOCAL;
        console.log(process.env.DB_LOCAL_USERNAME)

       connectionURI = connectionURI.replace('<username>', process.env.DB_LOCAL_USERNAME)
       connectionURI =  connectionURI.replace('<password>', process.env.DB_LOCAL_PASSWORD)

        return connectionURI;
    }
    

}

const connectDb = async () => {
    const uri = getConnectionString();
    console.log(uri)

    await mongoose.connect(uri, { dbName: process.env.DB_NAME})
    console.log('Connected between backend and mongodb by mongoose ')
}

module.exports = connectDb;