import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @ApiOperation({ summary: 'Get all events' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.calendarService.findAll({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @ApiOperation({ summary: 'Get event by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.calendarService.findById(id);
    }

    @ApiOperation({ summary: 'Create event' })
    @Post()
    async create(@Body() eventData: CreateEventDto) {
        return this.calendarService.create(eventData);
    }

    @ApiOperation({ summary: 'Update event' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() eventData: UpdateEventDto) {
        return this.calendarService.update(id, eventData);
    }

    @ApiOperation({ summary: 'Delete event' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.calendarService.delete(id);
    }
}
