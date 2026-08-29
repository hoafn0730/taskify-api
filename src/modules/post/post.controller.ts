import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @ApiOperation({ summary: 'Get all posts' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.postService.findAll({
            skip: (page - 1) * pageSize,
            take: pageSize,
            relations: ['author'],
        });
    }

    @ApiOperation({ summary: 'Get post by slug' })
    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return this.postService.findBySlug(slug);
    }

    @ApiOperation({ summary: 'Create post' })
    @Post()
    async create(@Body() data: CreatePostDto) {
        return this.postService.create(data);
    }

    @ApiOperation({ summary: 'Update post' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdatePostDto) {
        return this.postService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete post' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.postService.delete(id);
    }

    @ApiOperation({ summary: 'Toggle favorite post' })
    @Post(':id/favorite')
    async toggleFavorite(
        @Param('id') id: number,
        @Req() req: RequestWithUser,
        @Body() userData: { userName?: string; userAvatar?: string },
    ) {
        return this.postService.toggleFavorite(id, req.user.id, userData as { userName: string; userAvatar: string });
    }
}
