import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateConversationDto } from './dto/conversation.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    @ApiOperation({ summary: 'Get user conversations' })
    async getConversations(@GetUser('id') userId: number) {
        const data = await this.chatService.getConversations(userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get conversation details' })
    async getConversation(@Param('id') id: number, @GetUser('id') userId: number) {
        const data = await this.chatService.getConversation(id, userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data,
        };
    }

    @Get(':id/messages')
    @ApiOperation({ summary: 'Get conversation messages' })
    async getMessages(
        @Param('id') id: number,
        @GetUser('id') userId: number,
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
    ) {
        const result = await this.chatService.getMessages(id, userId, page, pageSize);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            ...result,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create conversation' })
    async store(@Body() data: CreateConversationDto, @GetUser('id') userId: number) {
        const conversation = await this.chatService.store(data, userId);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Conversation created successfully',
            data: conversation,
        };
    }
}
