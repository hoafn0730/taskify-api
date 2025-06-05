import db from '~/models';

const users = {};

const connection = (socket) => {
    const userId = socket.user.id;
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Handle user login
    socket.on('login', async () => {
        users[socket.id] = {
            userId,
            username: socket.user.username,
        };

        // Update user status
        await db.User.update(
            { socketId: socket.id, activityStatus: 'online', lastActivity: new Date() },
            { where: { id: userId } },
        );
        //
        //         // Get and broadcast online users
        //         const onlineUsers = await db.User.findAll({
        //             where: { activityStatus: 'online' },
        //             attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
        //         });
        //
        //         socket.emit('usersOnline', onlineUsers);

        // Get user conversations
        const conversations = await db.Conversation.find();
        socket.emit('conversations', conversations);
    });

    socket.on('joinConversation', async ({ conversationId }) => {
        socket.join(`conversation:${conversationId}`);
    });

    socket.on('leaveConversation', ({ conversationId }) => {
        socket.leave(`conversation:${conversationId}`);
    });

    // Handle private messages (1-1 chat)
    socket.on('sendMessage', async (data) => {
        const { conversationId, content, contentType, replyTo } = data;

        const messageData = {
            senderId: userId,
            conversationId,
            content,
            contentType,
            replyTo,
        };

        // Save message to database
        const savedMessage = await db.Message.create({
            ...messageData,
        });

        // Broadcast to conversation participants
        socket.to(`conversation:${conversationId}`).emit('newMessage', savedMessage);

        // Acknowledge message sent
        socket.emit('messageSent', savedMessage);
    });

    // Handle room operations
    socket.on('joinRoom', async ({ roomId }) => {
        socket.join(`conversation:${roomId}`);
    });

    socket.on('leaveRoom', ({ roomId }) => {
        socket.leave(`conversation:${roomId}`);
    });

    // Handle typing indicators
    socket.on('typing', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('userTyping', {
            userId,
            username: socket.user.username,
        });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
        console.log(`User ${socket.user.username} disconnected: ${socket.id}`);

        // Update user status
        await db.User.update(
            { socketId: '', activityStatus: 'offline', lastActivity: new Date() },
            { where: { id: socket.userId } },
        );

        delete users[socket.id];
    });
};

export default { connection };
