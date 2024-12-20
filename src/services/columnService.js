import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import db from '~/models';

const getOne = async (columnId) => {
    try {
        const data = await db.Column.findOne({ where: { id: columnId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [column, created] = await db.Column.findOrCreate({
            where: { ...data, uuid: uuidv4(), slug: slugify(data.title, { lower: true }) },
        });

        // Update board
        const board = await db.Board.findOne({ where: { id: data.boardId } });
        board.update({ columnOrderIds: [...board.columnOrderIds, column.uuid] });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return column;
    } catch (error) {
        throw error;
    }
};

const update = async (columnId, data) => {
    try {
        const column = await db.Column.update(
            { ...data, ...(data.title ? { slug: slugify(data.title, { lower: true }) } : {}) },
            {
                where: {
                    id: columnId,
                },
            },
        );

        return column;
    } catch (error) {
        throw error;
    }
};

const destroy = async (columnId) => {
    try {
        const column = await db.Column.destroy({
            where: {
                id: columnId,
            },
        });

        if (column) {
            return { message: 'Successfully!' };
        }

        return { message: 'Error' };
    } catch (error) {
        throw error;
    }
};

export default {
    getOne,
    store,
    update,
    destroy,
};
