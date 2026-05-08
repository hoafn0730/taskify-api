import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/workspaces')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @ApiOperation({ summary: 'Get workspace for user' })
    @Get()
    async findOne(@Req() req: RequestWithUser) {
        return this.workspaceService.getWorkspaceWithBoards(req.user.id);
    }

    @ApiOperation({ summary: 'Create workspace' })
    @Post()
    async create(@Req() req: RequestWithUser, @Body() data: CreateWorkspaceDto) {
        return this.workspaceService.store({ ...data, userId: req.user.id });
    }

    @ApiOperation({ summary: 'Update workspace' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateWorkspaceDto) {
        return this.workspaceService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete workspace' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.workspaceService.destroy(id);
    }
}
