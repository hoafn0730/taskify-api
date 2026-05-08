import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

@Entity('Messages')
@Index(['conversationId', 'createdAt'])
@Index(['senderId'])
export class Message extends BaseEntity {
    @Column()
    senderId: number;

    @Column()
    conversationId: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({
        type: 'enum',
        enum: ['text', 'image', 'file', 'voice', 'video'],
        default: 'text',
    })
    contentType: string;

    @Column({ nullable: true })
    replyTo: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown>;

    @Column({ default: false })
    isEdited: boolean;

    @Column({ type: 'timestamp', nullable: true })
    editedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @ManyToOne(() => Message, (message) => message.replies)
    @JoinColumn({ name: 'replyTo' })
    repliedMessage: Message;

    @OneToMany(() => Message, (message) => message.repliedMessage)
    replies: Message[];
}
