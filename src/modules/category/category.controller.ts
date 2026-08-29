import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({ summary: 'Get all categories' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.categoryService.findAll({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @ApiOperation({ summary: 'Get category by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.categoryService.findById(id);
    }

    @ApiOperation({ summary: 'Create category' })
    @Post()
    async create(@Body() categoryData: CreateCategoryDto) {
        // TODO: Socket emit 'notification'
        return this.categoryService.create(categoryData);
    }

    @ApiOperation({ summary: 'Update category' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() categoryData: UpdateCategoryDto) {
        return this.categoryService.update(id, categoryData);
    }

    @ApiOperation({ summary: 'Delete category' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.categoryService.delete(id);
    }
}
