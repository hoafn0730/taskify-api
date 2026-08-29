import { Entity, Column as TypeOrmColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Board } from './board.entity';
import { Column } from './column.entity';

@Entity('Cards')
export class Card extends BaseEntity {
    @TypeOrmColumn()
    boardId: number;

    @TypeOrmColumn()
    columnId: number;

    @TypeOrmColumn()
    title: string;

    @TypeOrmColumn({ type: 'text', nullable: true })
    description: string;

    @TypeOrmColumn({ nullable: true })
    image: string;

    @TypeOrmColumn({ unique: true, nullable: true })
    slug: string;

    @TypeOrmColumn({ nullable: true })
    shortLink: string;

    @TypeOrmColumn({ nullable: true })
    uuid: string;

    @TypeOrmColumn({ type: 'timestamp', nullable: true })
    dueStart: Date;

    @TypeOrmColumn({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @TypeOrmColumn({ default: false })
    dueComplete: boolean;

    @TypeOrmColumn({ default: -1 })
    dueReminder: number;

    @TypeOrmColumn({ type: 'timestamp', nullable: true })
    archivedAt: Date;

    @TypeOrmColumn({ nullable: true })
    priority: string;

    @TypeOrmColumn({ nullable: true })
    labels: string;

    @TypeOrmColumn({ unique: true, nullable: true })
    cardCode: string;

    @ManyToOne(() => Board)
    @JoinColumn({ name: 'boardId' })
    board: Board;

    @ManyToOne(() => Column, (column) => column.cards)
    @JoinColumn({ name: 'columnId' })
    column: Column;
}
