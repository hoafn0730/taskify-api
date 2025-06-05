import db from '~/models';
import { conversationService, messageService, userService } from '~/services';

const users = new Map(); // Store connected users

const connection = (socket) => {
    const userId = socket.user.id;
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Handle user login
    socket.on('login', async () => {
        try {
            // Store user connection
            users.set(socket.id, {
                userId,
                username: socket.user.username,
                displayName: socket.user.displayName,
            });

            // Update user status in database
            await db.User.update(
                {
                    socketId: socket.id,
                    activityStatus: 'online',
                    lastActivity: new Date(),
                },
                { where: { id: userId } },
            );

            // Get user conversations with participants and last message
            const conversations = await conversationService.get({
                include: [
                    {
                        model: db.Participant,
                        as: 'participants',
                        where: { userId },
                        include: [
                            {
                                model: db.User,
                                as: 'user',
                                attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
                            },
                        ],
                    },
                    {
                        model: db.Message,
                        as: 'messages',
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                        required: false,
                    },
                ],
                order: [['lastMessageAt', 'DESC']],
            });

            // Join user to conversation rooms
            for (const conv of conversations) {
                socket.join(`conversation:${conv.id}`);
            }

            socket.emit('conversations', conversations);

            // Get and broadcast online users
            const onlineUsers = await userService.get({
                where: { activityStatus: 'online' },
                attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
                all: true,
            });

            global.io.emit('usersOnline', onlineUsers);
        } catch (error) {
            console.error('Login error:', error);
            socket.emit('error', { message: 'Login failed' });
        }
    });

    // Handle joining conversation
    socket.on('joinConversation', async ({ conversationId }) => {
        try {
            // Verify user is participant
            const participant = await db.Participant.findOne({
                where: {
                    conversationId,
                    userId,
                },
            });

            if (!participant) {
                socket.emit('error', { message: 'Access denied' });
                return;
            }

            socket.join(`conversation:${conversationId}`);

            // Update last read time
            await db.Participant.update({ lastReadAt: new Date() }, { where: { conversationId, userId } });
        } catch (error) {
            console.error('Join conversation error:', error);
            socket.emit('error', { message: 'Failed to join conversation' });
        }
    });

    socket.on('leaveConversation', ({ conversationId }) => {
        socket.leave(`conversation:${conversationId}`);
    });

    // Handle private messages (1-1 chat)
    socket.on('sendMessage', async (data) => {
        try {
            const { conversationId, content, contentType = 'text', replyTo } = data;

            // Verify user is participant
            const participant = await db.Participant.findOne({
                where: {
                    conversationId,
                    userId,
                },
            });

            if (!participant) {
                socket.emit('error', { message: 'Access denied' });
                return;
            }

            // Save message to database
            const message = await db.Message.create({
                senderId: userId,
                conversationId,
                content,
                contentType,
                replyTo,
            });

            // Get complete message with sender info
            const savedMessage = await db.Message.findByPk(message.id, {
                include: [
                    {
                        model: db.User,
                        as: 'sender',
                        attributes: ['id', 'username', 'displayName', 'avatar'],
                    },
                ],
            });

            // Update conversation last message time
            await db.Conversation.update({ lastMessageAt: new Date() }, { where: { id: conversationId } });

            // Broadcast to conversation participants
            socket.to(`conversation:${conversationId}`).emit('newMessage', savedMessage);

            // Acknowledge message sent to sender
            socket.emit('messageSent', savedMessage);
        } catch (error) {
            console.error('Send message error:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicator
    socket.on('typing', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('userTyping', {
            userId,
            username: socket.user.username,
            displayName: socket.user.displayName,
        });
    });

    // Handle stop typing
    socket.on('stopTyping', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('userStoppedTyping', {
            userId,
            username: socket.user.username,
        });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
        try {
            console.log(`User ${socket.user.username} disconnected: ${socket.id}`);

            // Update user status
            await db.User.update(
                {
                    socketId: null,
                    activityStatus: 'offline',
                    lastActivity: new Date(),
                },
                { where: { id: userId } },
            );

            // Remove from users map
            users.delete(socket.id);

            // Broadcast updated online users
            const onlineUsers = await db.User.findAll({
                where: { activityStatus: 'online' },
                attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
            });

            // ✅ Gửi tới TẤT CẢ clients - mọi người đều biết ai offline
            global.io.emit('usersOnline', onlineUsers);
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    });
};

export default { connection };
