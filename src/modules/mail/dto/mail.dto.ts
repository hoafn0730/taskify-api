import { IsNotEmpty, IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveMailDto {
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    id?: number;

    @ApiProperty({ example: 'subject' })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({ example: 'message content' })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty({ example: ['inbox'] })
    @IsArray()
    @IsOptional()
    labelIds?: string[];

    @ApiProperty({ example: ['user@example.com'] })
    @IsArray()
    @IsOptional()
    to?: string[];

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isStarred?: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isImportant?: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isUnread?: boolean;
}
