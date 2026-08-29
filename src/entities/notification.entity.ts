import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('Notifications')
export class Notification extends BaseEntity {
    @Column({ nullable: true })
    senderId: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    link: string;

    @Column({ default: false })
    isRead: boolean;

    @Column({ nullable: true })
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
