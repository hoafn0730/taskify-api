import db from '~/models';
import { slugify } from '~/utils/formatters';
import columnService from './columnService';
import cardService from './cardService';

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
    try {
        const data = await db.Board.findOne({
            where: { slug: slug },
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
            where: { ...data, slug: slugify(data.title) },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: board };
    } catch (error) {
        throw error;
    }
};

const update = async (boardId, data) => {
    try {
        const board = await db.Board.update(
            { ...data },
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
    // eslint-disable-next-line no-useless-catch
    try {
        // Cap nhat mang cardOrderIds trong column bau dau
        await columnService.update(data.prevColumnId, { cardOrderIds: data.prevCardOrderIds });

        // Cap nhat mang cardOrderIds trong column moi
        await columnService.update(data.nextColumnId, { cardOrderIds: data.nextCardOrderIds });

        const card = await db.Card.findOne({ where: { id: data.currentCardId } });

        // Cap nhat truong columnId moi
        await cardService.update(data.currentCardId, { columnId: data.nextColumnId, title: card.title });

        return { message: 'Successfully' };
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
};
