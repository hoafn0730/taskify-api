import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkspaceBoard } from './workspaceboard.entity';
import { Member } from './member.entity';
import { Column as ColumnEntity } from './column.entity';

@Entity('Boards')
export class Board extends BaseEntity {
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    type: string;

    @Column({ unique: true, nullable: true })
    slug: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    shortLink: string;

    @Column({ nullable: true })
    tags: string;

    @Column({ type: 'json', nullable: false })
    columnOrderIds: string[];

    @Column({ unique: true, nullable: true })
    boardCode: string;

    @OneToMany(() => WorkspaceBoard, (workspaceBoard) => workspaceBoard.board)
    workspaceBoards: WorkspaceBoard[];

    @OneToMany(() => Member, (member) => member.board)
    members: Member[];

    @OneToMany(() => ColumnEntity, (column) => column.board)
    columns: ColumnEntity[];
}
