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

const getOne = async (boardId) => {
    try {
        const data = await db.Board.findOne({
            where: { id: boardId },
            include: {
                model: db.Column,
                as: 'columns',
                include: { model: db.Card, as: 'cards' },
            },
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const getBoardBySlug = async (slug) => {
    // Debug Visualizer
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
                description: data.description,
                type: data.type,
                slug: slugify(data.title, { lower: true }),
            },
            raw: true,
        });

        // * B3: Tao nhieu column cua board vua tao
        const orderedColumns = mapOrder(data.columns, data.columnOrderIds, 'uuid').map((col) => ({
            ...col,
            boardId: board.id,
            uuid: uuidv4(),
            slug: slugify(col.title, { lower: true }),
        }));

        const columnOrderIds = [];
        // * tao card cho tung column
        for (const col of orderedColumns) {
            const [column] = await db.Column.findOrCreate({
                where: {
                    boardId: col.boardId,
                    title: col.title,
                    uuid: col.uuid,
                    slug: col.slug,
                },
                raw: true,
            });
            const orderedCards = mapOrder(col.cards, col.cardOrderIds, 'uuid').map((card) => ({
                ...card,
                boardId: board.id,
                columnId: column.id,
                uuid: uuidv4(),
                slug: slugify(card.title, { lower: true }),
            }));
            const cards = await db.Card.bulkCreate(orderedCards, { raw: true });

            // * update cardOrderIds in columns
            columnService.update(column.id, { cardOrderIds: cards.map((card) => card.uuid) });
            columnOrderIds.push(column.uuid);

            for (const [cardIndex, card] of cards.entries()) {
                const checklists = await db.Checklist.bulkCreate(
                    col.cards[cardIndex].checklists.map((checklist) => ({
                        boardId: board.id,
                        cardId: card.id,
                        title: checklist.title,
                    })),
                    { raw: true },
                );

                for (const [checklistIndex, checklist] of checklists.entries()) {
                    await db.CheckItem.bulkCreate(
                        col.cards[cardIndex].checklists[checklistIndex].checkItems.map((checkItem) => ({
                            checklistId: checklist.id,
                            title: checkItem.title,
                        })),
                    );
                }
            }
        }

        // * update columnOrderIds in board
        update(board.id, { columnOrderIds: columnOrderIds });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return board;
    } catch (error) {
        throw error;
    }
};

export default {
    get,
    getOne,
    getBoardBySlug,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
    generate,
};
