import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateChecklistDto, UpdateChecklistDto, CreateCheckItemDto, UpdateCheckItemDto } from './dto/checklist.dto';

@ApiTags('Checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/checklists')
export class ChecklistController {
    constructor(private readonly checklistService: ChecklistService) {}

    @ApiOperation({ summary: 'Create checklist' })
    @Post()
    async create(@Body() data: CreateChecklistDto) {
        return this.checklistService.store(data);
    }

    @ApiOperation({ summary: 'Update checklist' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateChecklistDto) {
        return this.checklistService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete checklist' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.checklistService.delete(id);
    }

    @ApiOperation({ summary: 'Create check item' })
    @Post(':id/checkItems')
    async createCheckItem(@Param('id') id: number, @Body() data: CreateCheckItemDto) {
        return this.checklistService.storeCheckItem({ ...data, checklistId: id });
    }

    @ApiOperation({ summary: 'Update check item' })
    @Put(':id/checkItems/:checkItemId')
    async updateCheckItem(
        @Param('id') id: number,
        @Param('checkItemId') checkItemId: number,
        @Body() data: UpdateCheckItemDto,
    ) {
        return this.checklistService.updateCheckItem(id, checkItemId, data);
    }

    @ApiOperation({ summary: 'Delete check item' })
    @Delete(':id/checkItems/:checkItemId')
    async deleteCheckItem(@Param('id') id: number, @Param('checkItemId') checkItemId: number) {
        return this.checklistService.destroyCheckItem(id, checkItemId);
    }
}
