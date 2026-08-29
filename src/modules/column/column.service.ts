import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Column } from '../../entities/column.entity';
import { Board } from '../../entities/board.entity';
import { Card } from '../../entities/card.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Column)
        private columnRepository: Repository<Column>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
        private dataSource: DataSource,
    ) {}

    async store(data: CreateColumnDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const column = queryRunner.manager.create(Column, {
                ...data,
                uuid: uuidv4(),
            });
            const savedColumn = await queryRunner.manager.save(column);

            const board = await queryRunner.manager.findOne(Board, {
                where: { id: data.boardId },
            });

            if (board) {
                board.columnOrderIds = [...(board.columnOrderIds || []), savedColumn.uuid];
                await queryRunner.manager.save(board);
            }

            await queryRunner.commitTransaction();
            return savedColumn;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: UpdateColumnDto) {
        await this.columnRepository.update(id, data);
        return this.columnRepository.findOne({ where: { id } });
    }

    async destroy(id: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const column = await queryRunner.manager.findOne(Column, {
                where: { id },
            });

            if (!column) {
                throw new NotFoundException('Column not found');
            }

            const board = await queryRunner.manager.findOne(Board, {
                where: { id: column.boardId },
            });

            if (board) {
                board.columnOrderIds = board.columnOrderIds.filter((uuid) => uuid !== column.uuid);
                await queryRunner.manager.save(board);
            }

            await queryRunner.manager.softDelete(Card, { columnId: id });
            await queryRunner.manager.softDelete(Column, { id });

            await queryRunner.commitTransaction();
            return { message: 'Successfully' };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
