import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('Mails')
export class Mail extends BaseEntity {
    @Column({ nullable: true })
    to: number;

    @Column({ nullable: true })
    from: number;

    @Column({ default: 'drafts' })
    folder: string;

    @Column({ nullable: true })
    subject: string;

    @Column({ nullable: true, type: 'text' })
    message: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'from' })
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'to' })
    recipient: User;
}
