import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Conversation } from '../../entities/conversation.entity';
import { Message } from '../../entities/message.entity';
import { Participant } from '../../entities/participant.entity';
import { User } from '../../entities/user.entity';
import { CreateConversationDto } from './dto/conversation.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(Participant)
        private participantRepository: Repository<Participant>,
        private dataSource: DataSource,
    ) {}

    async getConversations(userId: number) {
        // 1. Get IDs of conversations the user is a participant in
        const userParticipants = await this.participantRepository.find({
            where: { userId },
            select: ['conversationId'],
        });

        const conversationIds = userParticipants.map((p) => p.conversationId);

        if (conversationIds.length === 0) {
            return [];
        }

        // 2. Get conversations with participants and last message
        const conversations = await this.conversationRepository.find({
            where: { id: In(conversationIds) },
            relations: ['participants', 'participants.user', 'messages', 'messages.sender'],
            order: { lastMessageAt: 'DESC' },
        });

        // Flatten logic similar to chatController.js
        return conversations.map((conv) => ({
            ...conv,
            messages: conv.messages.slice(-1), // Only keep the last message
            participants: conv.participants.map((p) => ({
                ...p.user,
                role: p.role,
                userId: p.userId,
            })),
        }));
    }

    async getConversation(id: number, userId: number) {
        const participant = await this.participantRepository.findOne({
            where: { conversationId: id, userId },
        });

        if (!participant) {
            throw new ForbiddenException('Access denied');
        }

        const conversation = await this.conversationRepository.findOne({
            where: { id },
            relations: ['participants', 'participants.user', 'messages', 'messages.sender'],
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return {
            ...conversation,
            participants: conversation.participants.map((p) => ({
                ...p.user,
                role: p.role,
                userId: p.userId,
            })),
        };
    }

    async getMessages(conversationId: number, userId: number, page = 1, pageSize = 10) {
        const participant = await this.participantRepository.findOne({
            where: { conversationId, userId },
        });

        if (!participant) {
            throw new ForbiddenException('Access denied');
        }

        const [messages, total] = await this.messageRepository.findAndCount({
            where: { conversationId },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            data: messages.reverse(),
            meta: {
                total,
                page,
                pageSize,
            },
        };
    }

    async store(
        data: CreateConversationDto & { messages?: Array<{ content: string; contentType?: string }> },
        userId: number,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const conversation = this.conversationRepository.create({
                title: data.title,
                type: data.type || 'private',
                createdBy: userId,
                lastMessageAt: new Date(),
            });
            const savedConversation = await queryRunner.manager.save(conversation);

            const participantIds = [...new Set([userId, ...(data.participantIds || [])])];
            const participants = participantIds.map((pid) =>
                this.participantRepository.create({
                    conversationId: savedConversation.id,
                    userId: pid,
                    role: pid === userId ? 'admin' : 'member',
                }),
            );
            await queryRunner.manager.save(participants);

            if (data.messages && data.messages.length > 0) {
                const messages = data.messages.map((m) =>
                    this.messageRepository.create({
                        senderId: userId,
                        conversationId: savedConversation.id,
                        content: m.content,
                        contentType: m.contentType || 'text',
                    }),
                );
                await queryRunner.manager.save(messages);
            }

            await queryRunner.commitTransaction();
            return this.getConversation(savedConversation.id, userId);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
