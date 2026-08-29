import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    objectId: number;

    @ApiProperty({ example: 'board' })
    @IsString()
    @IsNotEmpty()
    objectType: string;

    @ApiProperty({ example: 'member' })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}

export class UpdateMemberDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    objectId: number;

    @ApiProperty({ example: 'board' })
    @IsString()
    @IsNotEmpty()
    objectType: string;

    @ApiProperty({ example: 'admin', required: false })
    @IsString()
    @IsOptional()
    role?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
