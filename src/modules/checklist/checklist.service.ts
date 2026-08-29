import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checklist } from '../../entities/checklist.entity';
import { CheckItem } from '../../entities/checkitem.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class ChecklistService extends BaseService<Checklist> {
    constructor(
        @InjectRepository(Checklist)
        private checklistRepository: Repository<Checklist>,
        @InjectRepository(CheckItem)
        private checkItemRepository: Repository<CheckItem>,
    ) {
        super(checklistRepository);
    }

    async store(data: { cardId: number; title: string; copyFrom?: number }) {
        const checklist = this.checklistRepository.create({
            cardId: data.cardId,
            title: data.title,
        });
        const savedChecklist = await this.checklistRepository.save(checklist);

        if (data.copyFrom) {
            const sourceChecklist = await this.checklistRepository.findOne({
                where: { id: data.copyFrom },
                relations: ['items'],
            });

            if (sourceChecklist && sourceChecklist.items.length > 0) {
                const copiedItems = sourceChecklist.items.map((item) =>
                    this.checkItemRepository.create({
                        checklistId: savedChecklist.id,
                        cardId: data.cardId,
                        title: item.title,
                        status: item.status,
                    }),
                );
                await this.checkItemRepository.save(copiedItems);
            }
        }

        return this.checklistRepository.findOne({
            where: { id: savedChecklist.id },
            relations: ['items'],
        });
    }

    async storeCheckItem(data: Partial<CheckItem>) {
        const checkItem = this.checkItemRepository.create(data);
        return this.checkItemRepository.save(checkItem);
    }

    async updateCheckItem(checklistId: number, checkItemId: number, data: Partial<CheckItem>) {
        await this.checkItemRepository.update({ id: checkItemId, checklistId }, data);
        return this.checkItemRepository.findOne({ where: { id: checkItemId } });
    }

    async destroyCheckItem(checklistId: number, checkItemId: number) {
        const result = await this.checkItemRepository.delete({ id: checkItemId, checklistId });
        return (result.affected ?? 0) > 0 ? { message: 'Successfully!' } : { message: 'Error' };
    }
}
