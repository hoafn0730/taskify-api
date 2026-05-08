import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @ApiOperation({ summary: 'Get comments by commentable' })
    @Get()
    async findByCommentable(
        @Query('commentableId') commentableId: number,
        @Query('commentableType') commentableType: string,
    ) {
        return this.commentService.findByCommentable(commentableId, commentableType);
    }

    @ApiOperation({ summary: 'Create comment' })
    @Post()
    async create(@Body() data: CreateCommentDto) {
        return this.commentService.create(data);
    }

    @ApiOperation({ summary: 'Update comment' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateCommentDto) {
        return this.commentService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete comment' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.commentService.delete(id);
    }
}
