import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
    @ApiProperty({ example: 'My New Board' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Description of the board', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'public', enum: ['public', 'private'] })
    @IsEnum(['public', 'private'])
    @IsOptional()
    type?: string;

    @ApiProperty({ example: 'https://example.com/image.png', required: false })
    @IsString()
    @IsOptional()
    image?: string;
}

export class UpdateBoardDto {
    @ApiProperty({ example: 'Updated Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Updated Description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'private', enum: ['public', 'private'], required: false })
    @IsEnum(['public', 'private'])
    @IsOptional()
    type?: string;

    @ApiProperty({ example: 'https://example.com/new-image.png', required: false })
    @IsString()
    @IsOptional()
    image?: string;
}

export class GenerateBoardDto {
    @ApiProperty({ example: 'Create a project management board for a software development team.' })
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class InviteToBoardDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsString()
    @IsNotEmpty()
    inviteEmail: string;
}

export class AcceptInviteDto {
    @ApiProperty({ example: 'jwt_token_here' })
    @IsString()
    @IsNotEmpty()
    token: string;
}
