import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Comments')
export class Comment extends BaseEntity {
    @Column()
    commentableId: number;

    @Column()
    commentableType: string;

    @Column()
    authorName: string;

    @Column({ nullable: true })
    authorAvatar: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    postedAt: Date;
}
