import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailProvider } from './mail.provider';
import { Mail } from '../../entities/mail.entity';
import { User } from '../../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mail, User])],
    controllers: [MailController],
    providers: [MailService, MailProvider],
    exports: [MailService],
})
export class MailModule {}
