import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkspaceBoard } from './workspaceboard.entity';

@Entity('Workspaces')
export class Workspace extends BaseEntity {
    @Column()
    userId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    type: string;

    @OneToMany(() => WorkspaceBoard, (workspaceBoard) => workspaceBoard.workspace)
    workspaceBoards: WorkspaceBoard[];
}
