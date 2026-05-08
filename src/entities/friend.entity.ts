import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('Friends')
@Index(['userId', 'friendId'], { unique: true })
export class Friend extends BaseEntity {
    @Column()
    userId: number;

    @Column()
    friendId: number;

    @Column({ default: 'pending' })
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    requester: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'friendId' })
    receiver: User;
}
