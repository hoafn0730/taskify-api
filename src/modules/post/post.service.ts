import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostFavorite } from '../../entities/postfavorite.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class PostService extends BaseService<Post> {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(PostFavorite)
        private postFavoriteRepository: Repository<PostFavorite>,
    ) {
        super(postRepository);
    }

    async findBySlug(slug: string) {
        return this.postRepository.findOne({ where: { slug }, relations: ['author'] });
    }

    async toggleFavorite(postId: number, userId: number, userData: { userName: string; userAvatar: string }) {
        const favorite = await this.postFavoriteRepository.findOne({ where: { postId, userId } });
        if (favorite) {
            await this.postFavoriteRepository.delete(favorite.id);
            await this.postRepository.decrement({ id: postId }, 'totalFavorites', 1);
            return { favorited: false };
        } else {
            const newFavorite = this.postFavoriteRepository.create({ postId, userId, ...userData });
            await this.postFavoriteRepository.save(newFavorite);
            await this.postRepository.increment({ id: postId }, 'totalFavorites', 1);
            return { favorited: true };
        }
    }
}
