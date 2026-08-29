import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Board } from './board.entity';

@Entity('Members')
export class Member extends BaseEntity {
    @Column()
    userId: number;

    @Column()
    objectId: number;

    @Column()
    objectType: string;

    @Column({ default: 'member' })
    role: string;

    @Column({ default: false })
    active: boolean;

    @ManyToOne(() => User, (user) => user.memberships)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Board, (board) => board.members)
    @JoinColumn({ name: 'objectId' })
    board: Board;
}
