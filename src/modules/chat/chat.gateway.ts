import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Participant } from '../../entities/participant.entity';
import { Message } from '../../entities/message.entity';
import { Conversation } from '../../entities/conversation.entity';
import { SocketWithUser } from '../../common/interfaces/socket-with-user.interface';

interface ConnectedUserInfo {
    userId: number;
    username: string;
    displayName: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private users = new Map<string, ConnectedUserInfo>();

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private chatService: ChatService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Participant)
        private participantRepository: Repository<Participant>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) {}

    async handleConnection(socket: SocketWithUser) {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                socket.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token) as { id: number };
            const user = await this.userService.findOneById(payload.id);
            if (!user) {
                socket.disconnect();
                return;
            }

            socket.user = user;
            this.users.set(socket.id, {
                userId: user.id,
                username: user.username || '',
                displayName: user.displayName || '',
            });

            await this.userRepository.update(user.id, {
                socketId: socket.id,
                activityStatus: 'online',
                lastActivity: new Date(),
            });

            const conversations = await this.chatService.getConversations(user.id);
            for (const conv of conversations) {
                socket.join(`conversation:${conv.id}`);
            }

            socket.emit('conversations', conversations);

            const onlineUsers = await this.userRepository.find({
                where: { activityStatus: 'online' },
                select: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
            });

            this.server.emit('usersOnline', onlineUsers);
            console.log(`User ${user.username} connected: ${socket.id}`);
        } catch (error) {
            console.error('Connection error:', error);
            socket.disconnect();
        }
    }

    async handleDisconnect(socket: SocketWithUser) {
        const user = socket.user;
        if (user) {
            await this.userRepository.update(user.id, {
                socketId: undefined,
                activityStatus: 'offline',
                lastActivity: new Date(),
            });

            this.users.delete(socket.id);

            const onlineUsers = await this.userRepository.find({
                where: { activityStatus: 'online' },
                select: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
            });

            this.server.emit('usersOnline', onlineUsers);
            console.log(`User ${user.username} disconnected: ${socket.id}`);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() socket: SocketWithUser,
        @MessageBody() data: { conversationId: number; content: string; contentType?: string; replyTo?: number },
    ) {
        const user = socket.user;
        const { conversationId, content, contentType = 'text', replyTo } = data;

        const participant = await this.participantRepository.findOne({
            where: { conversationId, userId: user.id },
        });

        if (!participant) {
            socket.emit('error', { message: 'Access denied' });
            return;
        }

        const message = this.messageRepository.create({
            senderId: user.id,
            conversationId,
            content,
            contentType,
            replyTo,
        });
        const savedMessage = await this.messageRepository.save(message);

        const fullMessage = await this.messageRepository.findOne({
            where: { id: savedMessage.id },
            relations: ['sender'],
        });

        await this.conversationRepository.update(conversationId, { lastMessageAt: new Date() });

        this.server.to(`conversation:${conversationId}`).emit('newMessage', fullMessage);
        socket.emit('messageSent', fullMessage);
    }

    @SubscribeMessage('typing')
    handleTyping(@ConnectedSocket() socket: SocketWithUser, @MessageBody() data: { conversationId: number }) {
        const user = socket.user;
        socket.to(`conversation:${data.conversationId}`).emit('userTyping', {
            userId: user.id,
            username: user.username,
            displayName: user.displayName,
        });
    }

    @SubscribeMessage('stopTyping')
    handleStopTyping(@ConnectedSocket() socket: SocketWithUser, @MessageBody() data: { conversationId: number }) {
        const user = socket.user;
        socket.to(`conversation:${data.conversationId}`).emit('userStoppedTyping', {
            userId: user.id,
            username: user.username,
        });
    }
}
