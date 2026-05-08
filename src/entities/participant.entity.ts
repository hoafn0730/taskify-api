import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

@Entity('Participants')
export class Participant extends BaseEntity {
    @Column()
    userId: number;

    @Column()
    conversationId: number;

    @Column({
        type: 'enum',
        enum: ['admin', 'member'],
        default: 'member',
    })
    role: string;

    @Column({ type: 'timestamp', nullable: true })
    lastReadAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.participants)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;
}
