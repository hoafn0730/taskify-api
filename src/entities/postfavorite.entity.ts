import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('PostFavorites')
export class PostFavorite extends BaseEntity {
    @Column()
    postId: number;

    @Column()
    userId: number;

    @Column({ nullable: true })
    userName: string;

    @Column({ nullable: true })
    userAvatar: string;
}
