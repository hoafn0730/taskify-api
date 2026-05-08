import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Card } from './card.entity';
import { Checklist } from './checklist.entity';

@Entity('CheckItems')
export class CheckItem extends BaseEntity {
    @Column()
    cardId: number;

    @Column()
    checklistId: number;

    @Column({ nullable: true })
    title: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => Card)
    @JoinColumn({ name: 'cardId' })
    card: Card;

    @ManyToOne(() => Checklist, (checklist) => checklist.items)
    @JoinColumn({ name: 'checklistId' })
    checklist: Checklist;
}
