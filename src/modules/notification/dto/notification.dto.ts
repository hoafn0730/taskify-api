import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 'New comment on your card' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'John Doe commented: \"Great job!\"' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'comment' })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: '/dashboard/kanban/1' })
    @IsString()
    @IsOptional()
    link?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}

export class UpdateNotificationDto {
    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}
