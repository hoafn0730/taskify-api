import { IsNotEmpty, IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
    @ApiProperty({ example: 'Project Discussion', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'group', enum: ['private', 'group'] })
    @IsEnum(['private', 'group'])
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: [2, 3] })
    @IsArray()
    @IsNotEmpty()
    participantIds: number[];
}
