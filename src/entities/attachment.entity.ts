import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { File } from './file.entity';

@Entity('Attachments')
export class Attachment extends BaseEntity {
    @Column()
    fileId: number;

    @Column()
    objectId: number;

    @Column()
    objectType: string;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'fileId' })
    file: File;
}
