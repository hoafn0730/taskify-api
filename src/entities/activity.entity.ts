import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('Activities')
export class Activity extends BaseEntity {
    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    userId: number;

    @Column({ nullable: true })
    target: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
