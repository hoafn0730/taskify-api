import db from '~/models';
import { slugify } from '~/utils/formatters';

const getDetail = async (boardId) => {
    try {
        const data = await db.Board.findOne({ id: boardId });

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

export default {
    getDetail,
    store,
    update,
    destroy,
};
