import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { Checklist } from '../../entities/checklist.entity';
import { CheckItem } from '../../entities/checkitem.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Checklist, CheckItem])],
    controllers: [ChecklistController],
    providers: [ChecklistService],
    exports: [ChecklistService],
})
export class ChecklistModule {}
