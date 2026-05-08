import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { Column } from '../../entities/column.entity';
import { Board } from '../../entities/board.entity';
import { Card } from '../../entities/card.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Column, Board, Card])],
    providers: [ColumnService],
    controllers: [ColumnController],
    exports: [ColumnService],
})
export class ColumnModule {}
