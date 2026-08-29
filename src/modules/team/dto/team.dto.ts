import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({ example: 'Engineering Team' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'https://example.com/logo.png', required: false })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: 'Discuss engineering topics', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: [1, 2], required: false })
    @IsArray()
    @IsOptional()
    memberIds?: number[];
}

export class UpdateTeamDto {
    @ApiProperty({ example: 'Updated Team Name', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'https://example.com/new-logo.png', required: false })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: 'Updated description', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
