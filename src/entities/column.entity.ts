import { Entity, Column as TypeOrmColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Board } from './board.entity';
import { Card } from './card.entity';

@Entity('Columns')
export class Column extends BaseEntity {
    @TypeOrmColumn()
    boardId: number;

    @TypeOrmColumn()
    title: string;

    @TypeOrmColumn({ nullable: true })
    uuid: string;

    @TypeOrmColumn({ type: 'json', nullable: false })
    cardOrderIds: string[];

    @ManyToOne(() => Board, (board) => board.columns)
    @JoinColumn({ name: 'boardId' })
    board: Board;

    @OneToMany(() => Card, (card) => card.column)
    cards: Card[];
}
