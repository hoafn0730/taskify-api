import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual, FindOptionsWhere } from 'typeorm';
import { Card } from '../../entities/card.entity';
import { Column as ColumnEntity } from '../../entities/column.entity';
import { Member } from '../../entities/member.entity';
import { File as FileEntity } from '../../entities/file.entity';
import { Attachment } from '../../entities/attachment.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateCardDto, UpdateCardDto, UpdateFileDto } from './dto/card.dto';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
        @InjectRepository(ColumnEntity)
        private columnRepository: Repository<ColumnEntity>,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        @InjectRepository(FileEntity)
        private fileRepository: Repository<FileEntity>,
        @InjectRepository(Attachment)
        private attachmentRepository: Repository<Attachment>,
        private dataSource: DataSource,
    ) {}

    async get(page = 1, pageSize = 10, where: FindOptionsWhere<Card> = {}, relations: string[] = []) {
        const [data, total] = await this.cardRepository.findAndCount({
            where,
            relations,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            meta: {
                page,
                pageSize,
                total,
            },
            data,
        };
    }

    async getUpNext() {
        return this.cardRepository.find({
            where: {
                dueDate: MoreThanOrEqual(new Date()),
            },
            relations: ['board'],
            order: { dueDate: 'ASC' },
        });
    }

    async store(data: CreateCardDto, userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const card = queryRunner.manager.create(Card, {
                ...data,
                uuid: uuidv4(),
            });
            const savedCard = await queryRunner.manager.save(card);

            const column = await queryRunner.manager.findOne(ColumnEntity, {
                where: { id: data.columnId },
            });

            if (!column) {
                throw new NotFoundException('Column not found');
            }

            column.cardOrderIds = [savedCard.uuid, ...(column.cardOrderIds || [])];
            await queryRunner.manager.save(column);

            await queryRunner.manager.save(Member, {
                userId,
                objectId: savedCard.id,
                objectType: 'card',
                role: 'reporter',
                active: true,
            });

            await queryRunner.commitTransaction();
            return savedCard;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: UpdateCardDto) {
        await this.cardRepository.update(id, data);
        return this.cardRepository.findOne({ where: { id } });
    }

    async destroy(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const card = await queryRunner.manager.findOne(Card, {
                where: { id },
            });
            if (!card) throw new NotFoundException('Card not found');

            const column = await queryRunner.manager.findOne(ColumnEntity, {
                where: { id: card.columnId },
            });

            if (column) {
                column.cardOrderIds = (column.cardOrderIds || []).filter((uuid) => uuid !== card.uuid);
                await queryRunner.manager.save(column);
            }

            await queryRunner.manager.softDelete(Card, { id });

            await queryRunner.commitTransaction();
            return { message: 'Card deleted successfully', cardId: id };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async toggleAssignee(cardId: number, userId: number) {
        const card = await this.cardRepository.findOne({ where: { id: cardId } });
        if (!card) throw new NotFoundException('Card not found');

        const member = await this.memberRepository.findOne({
            where: { userId, objectId: cardId, objectType: 'card' },
        });

        if (member) {
            await this.memberRepository.delete(member.id);
            return { assigned: false };
        } else {
            await this.memberRepository.insert({
                userId,
                objectId: cardId,
                objectType: 'card',
                role: 'member',
                active: true,
            });
            return { assigned: true };
        }
    }

    async updateFile(cardId: number, data: UpdateFileDto) {
        const file = this.fileRepository.create(data);
        const savedFile = await this.fileRepository.save(file);
        const attachment = this.attachmentRepository.create({
            objectId: cardId,
            objectType: 'card',
            fileId: savedFile.id,
        });
        await this.attachmentRepository.save(attachment);
        return savedFile;
    }

    async deleteFile(cardId: number, fileId: number) {
        await this.attachmentRepository.delete({ objectId: cardId, objectType: 'card', fileId });
        await this.fileRepository.delete(fileId);
        return { message: 'Successfully!' };
    }
}
