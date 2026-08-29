import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChecklistDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @ApiProperty({ example: 'My Checklist' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    copyFrom?: number;
}

export class UpdateChecklistDto {
    @ApiProperty({ example: 'Updated Checklist Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;
}

export class CreateCheckItemDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @ApiProperty({ example: 'Check Item Title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}

export class UpdateCheckItemDto {
    @ApiProperty({ example: 'Updated Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
