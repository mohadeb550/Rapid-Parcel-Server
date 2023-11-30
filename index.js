require('dotenv').config()
const connectDb = require('./src/db/connectDb')
const http = require('http')
const app = require('./src/app')
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const main = async () => {
    await connectDb();
    server.listen(port, () => {
        console.log("Server is listening on port", port)
    })
}

main();