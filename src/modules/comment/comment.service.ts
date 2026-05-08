import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class CommentService extends BaseService<Comment> {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {
        super(commentRepository);
    }

    async findByCommentable(commentableId: number, commentableType: string) {
        return this.commentRepository.find({
            where: { commentableId, commentableType },
            order: { postedAt: 'DESC' },
        });
    }
}
