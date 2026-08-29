import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
    @ApiProperty({ example: 'Task Title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Task Description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    boardId: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    columnId: number;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    dueDate?: string;
}

export class UpdateCardDto {
    @ApiProperty({ example: 'Updated Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Updated Description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    columnId?: number;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    dueDate?: string;
}

export class UpdateFileDto {
    @ApiProperty({ example: 'image.png' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'https://example.com/image.png' })
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty({ example: 'image/png' })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 1024 })
    @IsNumber()
    @IsNotEmpty()
    size: number;
}
