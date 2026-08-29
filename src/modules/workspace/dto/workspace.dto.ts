import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
    @ApiProperty({ example: 'My Workspace' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Workspace description', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateWorkspaceDto {
    @ApiProperty({ example: 'Updated Workspace Name', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Updated description', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
