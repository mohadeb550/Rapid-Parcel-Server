

const socket = () => {

    io.on('connection', socket => {

        socket.on('userMessage', (userMessages) => {
            console.log(userMessages)
            io.emit('sendToAdmin', userMessages)
        })

        socket.on('adminMessage', (adminMessages)=> {
            console.log(adminMessages)
            io.emit('sendToUser', adminMessages)
        })

        io.emit('message', 'Hello from the server');

      });
};

module.exports = socket;