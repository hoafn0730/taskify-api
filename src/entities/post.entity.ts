import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('Posts')
export class Post extends BaseEntity {
    @Column()
    title: string;

    @Column({ unique: true, nullable: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ nullable: true })
    coverUrl: string;

    @Column({
        type: 'enum',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    })
    publish: string;

    @Column({ nullable: true })
    metaTitle: string;

    @Column({ type: 'text', nullable: true })
    metaDescription: string;

    @Column({ type: 'json', nullable: true })
    metaKeywords: string[];

    @Column({ type: 'json', nullable: true })
    tags: string[];

    @Column({ default: 0 })
    totalViews: number;

    @Column({ default: 0 })
    totalShares: number;

    @Column({ default: 0 })
    totalComments: number;

    @Column({ default: 0 })
    totalFavorites: number;

    @Column()
    authorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;
}
