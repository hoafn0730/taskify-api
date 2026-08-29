import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Categories')
export class Category extends BaseEntity {
    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    slug: string;
}
