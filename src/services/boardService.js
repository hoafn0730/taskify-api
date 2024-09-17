import db from '~/models';
import { slugify } from '~/utils/formatters';
import columnService from './columnService';
import cardService from './cardService';

const get = async ({ page, pageSize = 10, where, ...options }) => {
    try {
        const skip = (page - 1) * pageSize;
        const { count, rows } = await db.Board.findAndCountAll({
            where: where,
            offset: skip,
            limit: pageSize,
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

const getDetail = async (boardId) => {
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

        // Cap nhat truong columnId moi
        await cardService.update(data.currentCardId, { columnId: data.nextColumnId });

        return { message: 'Successfully' };
    } catch (error) {
        throw error;
    }
};

export default {
    get,
    getDetail,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
};
