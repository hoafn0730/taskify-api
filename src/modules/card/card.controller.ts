import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateCardDto, UpdateCardDto, UpdateFileDto } from './dto/card.dto';

@ApiTags('Card')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/cards')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @ApiOperation({ summary: 'Get all cards' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.cardService.get(page, pageSize);
    }

    @ApiOperation({ summary: 'Get cards up next' })
    @Get('up-next')
    async getUpNext() {
        return this.cardService.getUpNext();
    }

    @ApiOperation({ summary: 'Create card' })
    @Post()
    async create(@Req() req: RequestWithUser, @Body() data: CreateCardDto) {
        return this.cardService.store(data, req.user.id);
    }

    @ApiOperation({ summary: 'Update card' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateCardDto) {
        return this.cardService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete card' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.cardService.destroy(id);
    }

    @ApiOperation({ summary: 'Toggle assignee' })
    @Post(':id/assignee')
    async toggleAssignee(@Param('id') id: number, @Body() data: { userId: number }) {
        return this.cardService.toggleAssignee(id, data.userId);
    }

    @ApiOperation({ summary: 'Update file' })
    @Post(':id/file')
    async updateFile(@Param('id') id: number, @Body() data: UpdateFileDto) {
        return this.cardService.updateFile(id, data);
    }

    @ApiOperation({ summary: 'Delete file' })
    @Delete(':id/file/:fileId')
    async deleteFile(@Param('id') id: number, @Param('fileId') fileId: number) {
        return this.cardService.deleteFile(id, fileId);
    }
}
