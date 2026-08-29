import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { ColumnModule } from './modules/column/column.module';
import { CardModule } from './modules/card/card.module';
import { ChatModule } from './modules/chat/chat.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CategoryModule } from './modules/category/category.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { CommentModule } from './modules/comment/comment.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MailModule } from './modules/mail/mail.module';
import { MemberModule } from './modules/member/member.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PostModule } from './modules/post/post.module';
import { TeamModule } from './modules/team/team.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false, // Set to false in production, using migrations or sync cautiously
                logging: configService.get<string>('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
        BoardModule,
        WorkspaceModule,
        ColumnModule,
        CardModule,
        ChatModule,
        CalendarModule,
        CategoryModule,
        ChecklistModule,
        CommentModule,
        PaymentModule,
        MailModule,
        MemberModule,
        NotificationModule,
        PostModule,
        TeamModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
