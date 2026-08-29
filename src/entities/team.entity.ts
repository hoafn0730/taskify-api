import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Teams')
export class Team extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    mail: string;

    @Column({ nullable: true })
    passMail: string;
}
