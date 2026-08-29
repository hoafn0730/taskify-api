import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMemberDto, UpdateMemberDto } from './dto/member.dto';

@ApiTags('Member')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @ApiOperation({ summary: 'Get members by object' })
    @Get()
    async findByObject(
        @Query('id') id: number,
        @Query('type') type: string,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
    ) {
        return this.memberService.findByObject(id, type, page, pageSize);
    }

    @ApiOperation({ summary: 'Get member by id' })
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.memberService.findById(id);
    }

    @ApiOperation({ summary: 'Create member' })
    @Post()
    async create(@Body() data: CreateMemberDto) {
        return this.memberService.create(data);
    }

    @ApiOperation({ summary: 'Update member' })
    @Put()
    async update(@Body() data: UpdateMemberDto) {
        await this.memberService.updateMember(data.userId, data.objectId, data.objectType, data);
        return { message: 'Successfully!' };
    }

    @ApiOperation({ summary: 'Delete member' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.memberService.delete(id);
    }
}
