import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Workspace } from './workspace.entity';
import { Board } from './board.entity';

@Entity('WorkspaceBoards')
export class WorkspaceBoard extends BaseEntity {
    @Column()
    workspaceId: number;

    @Column()
    boardId: number;

    @Column({ default: false })
    starred: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastView: Date;

    @ManyToOne(() => Workspace, (workspace) => workspace.workspaceBoards)
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace;

    @ManyToOne(() => Board, (board) => board.workspaceBoards)
    @JoinColumn({ name: 'boardId' })
    board: Board;
}
