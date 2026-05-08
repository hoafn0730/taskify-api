import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @ApiOperation({ summary: 'Get all notifications' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.notificationService.findAll({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @ApiOperation({ summary: 'Get notification by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.notificationService.findById(id);
    }

    @ApiOperation({ summary: 'Create notification' })
    @Post()
    async create(@Body() data: CreateNotificationDto) {
        // TODO: Socket emit 'notification'
        return this.notificationService.create(data);
    }

    @ApiOperation({ summary: 'Update notification' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateNotificationDto) {
        return this.notificationService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete notification' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.notificationService.delete(id);
    }
}
