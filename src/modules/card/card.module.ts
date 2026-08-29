import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from '../../entities/card.entity';
import { Column } from '../../entities/column.entity';
import { Member } from '../../entities/member.entity';
import { File } from '../../entities/file.entity';
import { Attachment } from '../../entities/attachment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Card, Column, Member, File, Attachment])],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
