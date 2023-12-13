

const socket = () => {

    io.on('connection', socket => {
       
        socket.on('userMessage', (message) => {
            socket.emit('sendToAdmin', message)
            console.log(message)
        })

        // socket.emit('message', 'Hello from the server!');
      });
};

module.exports = socket;