import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
    @ApiProperty({ example: 'To Do' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    boardId: number;
}

export class UpdateColumnDto {
    @ApiProperty({ example: 'In Progress', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
    @IsArray()
    @IsOptional()
    cardOrderIds?: string[];
}
