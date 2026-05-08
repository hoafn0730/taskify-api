import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Card } from './card.entity';
import { CheckItem } from './checkitem.entity';

@Entity('Checklists')
export class Checklist extends BaseEntity {
    @Column()
    cardId: number;

    @Column({ nullable: true })
    title: string;

    @ManyToOne(() => Card)
    @JoinColumn({ name: 'cardId' })
    card: Card;

    @OneToMany(() => CheckItem, (checkItem) => checkItem.checklist)
    items: CheckItem[];
}
