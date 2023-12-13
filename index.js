require('dotenv').config()
const connectDb = require('./src/db/connectDb')
const handleSocket = require('./socket/socket')
const http = require('http')
const app = require('./src/app')
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const main = async () => {
    await connectDb();
    app.listen(port, () => {
        console.log("Server is listening on port", port)
        handleSocket()
    })
}


main();