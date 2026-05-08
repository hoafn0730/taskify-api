import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@ApiTags('Team')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @ApiOperation({ summary: 'Get all teams' })
    @Get()
    async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.teamService.findAll({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @ApiOperation({ summary: 'Get team by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.teamService.findById(id);
    }

    @ApiOperation({ summary: 'Create team' })
    @Post()
    async create(@Body() data: CreateTeamDto) {
        return this.teamService.create(data);
    }

    @ApiOperation({ summary: 'Update team' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateTeamDto) {
        return this.teamService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete team' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.teamService.delete(id);
    }
}
