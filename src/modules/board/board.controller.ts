import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateBoardDto, UpdateBoardDto, GenerateBoardDto, InviteToBoardDto, AcceptInviteDto } from './dto/board.dto';

@ApiTags('Board')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/boards')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @ApiOperation({ summary: 'Get all boards for user' })
    @Get()
    async findAll(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('sortBy') sortBy: string = 'latest',
    ) {
        return this.boardService.findAll(req.user.id, page, pageSize, sortBy);
    }

    @ApiOperation({ summary: 'Search boards' })
    @Get('search')
    async search(@Query('q') q: string, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.boardService.search(q, page, pageSize);
    }

    @ApiOperation({ summary: 'Get board by slug' })
    @Get(':slug')
    async findOne(@Param('slug') slug: string, @Req() req: RequestWithUser) {
        const board = await this.boardService.getBoardBySlug(slug, req.user.id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: board,
        };
    }

    @ApiOperation({ summary: 'Create board' })
    @Post()
    async create(@Req() req: RequestWithUser, @Body() boardData: CreateBoardDto) {
        const board = await this.boardService.store({ ...boardData, userId: req.user.id });
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Board created successfully',
            data: board,
        };
    }

    @ApiOperation({ summary: 'Update board' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() boardData: UpdateBoardDto) {
        const board = await this.boardService.update(id, boardData);
        return {
            statusCode: HttpStatus.OK,
            message: 'Board updated successfully',
            data: board,
        };
    }

    @ApiOperation({ summary: 'Delete board' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.boardService.destroy(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Board deleted successfully',
        };
    }

    @ApiOperation({ summary: 'Generate board using AI' })
    @Post('generate')
    async generate(@Req() req: RequestWithUser, @Body() data: GenerateBoardDto) {
        const board = await this.boardService.generate(data.content, req.user.id);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Board generated successfully',
            data: board,
        };
    }

    @ApiOperation({ summary: 'Update board background' })
    @Post(':id/background')
    async updateBackground(@Param('id') id: number, @Body() data: { file: any }) {
        const board = await this.boardService.updateBackground(id, data.file);
        return {
            statusCode: HttpStatus.OK,
            message: 'Background updated successfully',
            data: board,
        };
    }

    @ApiOperation({ summary: 'Toggle star board' })
    @Post(':id/star')
    async toggleStar(@Param('id') id: number, @Req() req: RequestWithUser) {
        return this.boardService.toggleStarBoard(id, req.user.id);
    }

    @ApiOperation({ summary: 'Invite user to board' })
    @Post(':id/invite')
    async invite(@Param('id') id: number, @Body() data: InviteToBoardDto) {
        return this.boardService.invite(id, data.inviteEmail);
    }

    @ApiOperation({ summary: 'Accept invitation' })
    @Post('accept-invite')
    async acceptInvite(@Body() data: AcceptInviteDto) {
        return this.boardService.acceptInvite(data.token);
    }
}
