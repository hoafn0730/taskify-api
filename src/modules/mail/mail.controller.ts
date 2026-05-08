import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { SaveMailDto } from './dto/mail.dto';

@ApiTags('Mail')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @ApiOperation({ summary: 'Get mail list' })
    @Get()
    async findAll(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
        @Query('label') label?: string,
    ) {
        return this.mailService.getList(req.user.id, page, pageSize, label);
    }

    @ApiOperation({ summary: 'Get mail by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.mailService.findById(id);
    }

    @ApiOperation({ summary: 'Get mail labels' })
    @Get('labels')
    async getLabels() {
        return [
            { id: 'all', type: 'system', name: 'all', unreadCount: 3 },
            { id: 'inbox', type: 'system', name: 'inbox', unreadCount: 1 },
            { id: 'sent', type: 'system', name: 'sent', unreadCount: 0 },
            { id: 'drafts', type: 'system', name: 'drafts', unreadCount: 0 },
            { id: 'trash', type: 'system', name: 'trash', unreadCount: 0 },
            { id: 'spam', type: 'system', name: 'spam', unreadCount: 1 },
            { id: 'important', type: 'system', name: 'important', unreadCount: 1 },
            { id: 'starred', type: 'system', name: 'starred', unreadCount: 1 },
            { id: 'social', type: 'custom', name: 'social', unreadCount: 0, color: '#00AB55' },
            { id: 'promotions', type: 'custom', name: 'promotions', unreadCount: 2, color: '#FFC107' },
            { id: 'forums', type: 'custom', name: 'forums', unreadCount: 1, color: '#FF4842' },
        ];
    }

    @ApiOperation({ summary: 'Save mail (create or update)' })
    @Post()
    async save(@Req() req: RequestWithUser, @Body() data: SaveMailDto) {
        return this.mailService.saveMail(req.user.id, data);
    }

    @ApiOperation({ summary: 'Send mail' })
    @Post(':id/send')
    async send(@Param('id') id: number) {
        return this.mailService.sendMail(id);
    }

    @ApiOperation({ summary: 'Delete mail' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.mailService.delete(id);
    }
}
