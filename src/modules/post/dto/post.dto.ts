import { IsNotEmpty, IsString, IsArray, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'My Awesome Post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Short description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'Full content of the post' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'https://example.com/cover.png', required: false })
    @IsString()
    @IsOptional()
    coverUrl?: string;

    @ApiProperty({ example: 'published', enum: ['draft', 'published', 'archived'] })
    @IsEnum(['draft', 'published', 'archived'])
    @IsOptional()
    publish?: string;

    @ApiProperty({ example: ['tech', 'nestjs'], required: false })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    authorId: number;
}

export class UpdatePostDto {
    @ApiProperty({ example: 'Updated Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Updated content', required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 'published', enum: ['draft', 'published', 'archived'], required: false })
    @IsEnum(['draft', 'published', 'archived'])
    @IsOptional()
    publish?: string;

    @ApiProperty({ example: ['updated', 'tags'], required: false })
    @IsArray()
    @IsOptional()
    tags?: string[];
}
