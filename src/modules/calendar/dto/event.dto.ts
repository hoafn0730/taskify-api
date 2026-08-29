import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ example: 'Meeting with team' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    allDay?: boolean;

    @ApiProperty({ example: '#ff0000', required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 'Discuss project progress', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z' })
    @IsDateString()
    @IsNotEmpty()
    start: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    end?: string;
}

export class UpdateEventDto {
    @ApiProperty({ example: 'Meeting with team', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    allDay?: boolean;

    @ApiProperty({ example: '#ff0000', required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 'Discuss project progress', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    start?: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    end?: string;
}
