import { Controller, Post, Put, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ColumnService } from './column.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';

@ApiTags('columns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}

    @Post()
    @ApiOperation({ summary: 'Create column' })
    async store(@Body() data: CreateColumnDto) {
        const column = await this.columnService.store(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Column created successfully',
            data: column,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update column' })
    async update(@Param('id') id: number, @Body() data: UpdateColumnDto) {
        const column = await this.columnService.update(id, data);
        return {
            statusCode: HttpStatus.OK,
            message: 'Column updated successfully',
            data: column,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete column' })
    async destroy(@Param('id') id: number) {
        await this.columnService.destroy(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Column deleted successfully',
        };
    }
}
