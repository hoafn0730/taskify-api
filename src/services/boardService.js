import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import db from '~/models';
import columnService from './columnService';
import cardService from './cardService';
import googleAIGenerate from './googleAiService';
import { mapOrder } from '~/utils/sorts';

const get = async ({ page = 1, pageSize = 10, where, ...options }) => {
    try {
        const skip = (page - 1) * pageSize;
        const { count, rows } = await db.Board.findAndCountAll({
            where: where,
            offset: skip,
            limit: pageSize,
            distinct: true,
            ...options,
        });

        return {
            meta: {
                page,
                pageSize,
                total: count,
            },
            data: rows,
        };
    } catch (error) {
        throw error;
    }
};

const getBoardBySlug = async (slug) => {
    try {
        const data = await db.Board.findOne({
            where: { slug },
            include: [
                {
                    model: db.Column,
                    as: 'columns',
                    include: {
                        model: db.Card,
                        as: 'cards',
                        include: [
                            { model: db.Attachment, as: 'cover' },
                            { model: db.Attachment, as: 'attachments' },
                            {
                                model: db.Checklist,
                                as: 'checklists',
                                include: [
                                    {
                                        model: db.CheckItem,
                                        as: 'checkItems',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    model: db.Member,
                    as: 'members',
                    include: { model: db.User, as: 'user' },
                },
            ],
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [board, created] = await db.Board.findOrCreate({
            where: { ...data, slug: slugify(data.title, { lower: true }) },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return board;
    } catch (error) {
        throw error;
    }
};

const update = async (boardId, data) => {
    try {
        const board = await db.Board.update(
            { ...data, ...(data.title ? { slug: slugify(data.title, { lower: true }) } : {}) },
            {
                where: {
                    id: boardId,
                },
            },
        );

        return board;
    } catch (error) {
        throw error;
    }
};

const destroy = async (boardId) => {
    try {
        const board = await db.Board.destroy({
            where: {
                id: boardId,
            },
        });
        return board;
    } catch (error) {
        throw error;
    }
};

const moveCardToDifferentColumn = async (data) => {
    try {
        // Cap nhat mang cardOrderIds trong column bau dau
        await columnService.update(data.prevColumnId, {
            cardOrderIds: data.prevCardOrderIds,
        });

        // Cap nhat mang cardOrderIds trong column moi
        await columnService.update(data.nextColumnId, {
            cardOrderIds: data.nextCardOrderIds,
        });

        const card = await db.Card.findOne({ where: { id: data.currentCardId } });

        // Cap nhat truong columnId moi
        await cardService.update(data.currentCardId, {
            columnId: data.nextColumnId,
            title: card.title,
        });

        return { message: 'Successfully' };
    } catch (error) {
        throw error;
    }
};

const generate = async (content) => {
    try {
        // * B1: Tao content tu goi y
        const data = await googleAIGenerate(content);

        // * B2: Tao board tu content da tao
        // * Tao board
        const [board, created] = await db.Board.findOrCreate({
            where: {
                title: data.title,
                slug: slugify(data.title, { lower: true }),
            },
            defaults: {
                description: data.description,
                type: data.type,
            },
            raw: true,
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        // * B3: Tao nhieu column cua board vua tao
        const orderedColumns = mapOrder(data.columns, data.columnOrderIds, 'uuid');

        const columns = await db.Column.bulkCreate(
            orderedColumns.map((col) => ({
                ...col,
                boardId: board.id,
                uuid: uuidv4(),
                slug: slugify(col.title, { lower: true }),
            })),
            { raw: true },
        );

        await update(board.id, { columnOrderIds: columns.map((col) => col.uuid) });

        const allCards = [];
        for (const [index, col] of columns.entries()) {
            const orderedCards = mapOrder(data.columns[index].cards, data.columns[index].cardOrderIds, 'uuid').map(
                (card) => ({
                    ...card,
                    boardId: board.id,
                    columnId: col.id,
                    uuid: uuidv4(),
                    slug: slugify(card.title, { lower: true }),
                }),
            );
            allCards.push(...orderedCards);
        }

        // * Tạo tất cả thẻ trong một lần
        const cards = await db.Card.bulkCreate(allCards, { raw: true });

        // * Cập nhật cardOrderIds trong các cột
        const updateColumnsPromises = columns.map((column) =>
            columnService.update(column.id, {
                cardOrderIds: cards.filter((card) => card.columnId === column.id).map((card) => card.uuid),
            }),
        );
        await Promise.all(updateColumnsPromises);

        return board;
    } catch (error) {
        throw error;
    }
};

export default {
    get,
    getBoardBySlug,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
    generate,
};
