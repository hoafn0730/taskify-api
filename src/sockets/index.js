const users = {};

const connection = (socket) => {
    socket.on('login', function (data) {
        // saving userId to object with socket ID
        users[socket.id] = data.userId;
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
    });

    socket.on('say to someone', (id, msg) => {
        // send a private message to the socket with the given id
        socket.to(socket.id).emit('my message', msg);
    });

    // Listening for a specific event from a client
    socket.on('sendMessageToSpecificClient', (data) => {
        const { targetSocketId, message } = data;

        // Emit a message to the target client
        socket.to(targetSocketId).emit('privateMessage', message);
    });

    socket.on('chat message', (msg) => {
        console.log(`msg is:::${msg}`);
        // _io.emit('chat message', msg);
    });
};

export default { connection };
