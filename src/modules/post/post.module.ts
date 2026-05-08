import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../entities/post.entity';
import { PostFavorite } from '../../entities/postfavorite.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostFavorite])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
