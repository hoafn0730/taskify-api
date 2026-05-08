import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from '../../entities/board.entity';
import { User } from '../../entities/user.entity';
import { Column } from '../../entities/column.entity';
import { Card } from '../../entities/card.entity';
import { Member } from '../../entities/member.entity';
import { Workspace } from '../../entities/workspace.entity';
import { WorkspaceBoard } from '../../entities/workspaceboard.entity';
import { Checklist } from '../../entities/checklist.entity';
import { CheckItem } from '../../entities/checkitem.entity';
import { GeminiProvider } from '../../common/providers/gemini.provider';
import { CloudinaryProvider } from '../../common/providers/cloudinary.provider';
import { MailProvider } from '../mail/mail.provider';

@Module({
    imports: [
        TypeOrmModule.forFeature([Board, User, Column, Card, Member, Workspace, WorkspaceBoard, Checklist, CheckItem]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || '',
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [BoardService, GeminiProvider, CloudinaryProvider, MailProvider],
    controllers: [BoardController],
    exports: [BoardService],
})
export class BoardModule {}
