import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Member } from './member.entity';

@Entity('Users')
export class User extends BaseEntity {
    @Column({ unique: true, nullable: true })
    uid: string;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    type: string;

    @Column({ default: 'user' })
    role: string;

    @Column({
        type: 'enum',
        enum: ['active', 'pending', 'banned'],
        default: 'pending',
    })
    status: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: 'timestamp', nullable: true })
    verifiedAt: Date;

    @Column({
        type: 'enum',
        enum: ['online', 'offline', 'away'],
        default: 'offline',
    })
    activityStatus: string;

    @Column({ type: 'timestamp', nullable: true })
    lastActivity: Date;

    @Column({ nullable: true })
    socketId: string;

    @OneToMany(() => Member, (member) => member.user)
    memberships: Member[];
}
