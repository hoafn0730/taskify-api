import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Work' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Work related tasks', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'work', required: false })
    @IsString()
    @IsOptional()
    slug?: string;
}

export class UpdateCategoryDto {
    @ApiProperty({ example: 'Work', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Work related tasks', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'work', required: false })
    @IsString()
    @IsOptional()
    slug?: string;
}
