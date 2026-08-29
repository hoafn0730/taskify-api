import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    commentableId: number;

    @ApiProperty({ example: 'card' })
    @IsString()
    @IsNotEmpty()
    commentableType: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    authorName: string;

    @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
    @IsString()
    @IsOptional()
    authorAvatar?: string;

    @ApiProperty({ example: 'This is a comment' })
    @IsString()
    @IsNotEmpty()
    message: string;
}

export class UpdateCommentDto {
    @ApiProperty({ example: 'Updated comment message', required: false })
    @IsString()
    @IsOptional()
    message?: string;
}
