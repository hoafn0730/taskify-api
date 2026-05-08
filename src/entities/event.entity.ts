import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Events')
export class Event extends BaseEntity {
    @Column({ nullable: true })
    title: string;

    @Column({ default: false })
    allDay: boolean;

    @Column({ nullable: true })
    color: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    start: Date;

    @Column({ type: 'timestamp', nullable: true })
    end: Date;
}
