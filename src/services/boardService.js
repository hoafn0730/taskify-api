import { cloneDeep } from 'lodash';
import db from '~/models';
import { slugify } from '~/utils/formatters';

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
                attributes: { exclude: ['position'] },
                include: { model: db.Card, as: 'cards', attributes: { exclude: ['position'] } },
            },
            order: [
                [{ model: db.Column, as: 'columns' }, 'position', 'ASC'],
                [{ model: db.Column, as: 'columns' }, { model: db.Card, as: 'cards' }, 'position', 'ASC'],
            ],
        });

        const boardData = cloneDeep(data.toJSON());
        boardData.columnOrderIds = data.columns.map((col) => col.id);

        boardData.columns.forEach((col) => {
            col.cardOrderIds = col.cards.map((card) => card.id);
        });

        return boardData;
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

export default {
    get,
    getDetail,
    store,
    update,
    destroy,
};
