import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Files')
export class File extends BaseEntity {
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    path: string;

    @Column({ nullable: true })
    preview: string;

    @Column({ nullable: true })
    size: string;

    @Column({ nullable: true })
    type: string;
}
