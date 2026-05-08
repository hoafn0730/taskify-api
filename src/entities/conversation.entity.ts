import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Participant } from './participant.entity';

@Entity('Conversations')
export class Conversation extends BaseEntity {
    @Column({ nullable: true })
    title: string;

    @Column({
        type: 'enum',
        enum: ['private', 'group'],
        default: 'private',
    })
    type: string;

    @Column({ type: 'timestamp', nullable: true })
    lastMessageAt: Date;

    @Column()
    createdBy: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, unknown>;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdBy' })
    creator: User;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    @OneToMany(() => Participant, (participant) => participant.conversation)
    participants: Participant[];
}
