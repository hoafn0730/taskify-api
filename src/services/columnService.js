import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import db from '~/models';

const getOne = async (id) => {
    try {
        const data = await db.Column.findOne({ where: { id } });

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
        // Tìm column
        const column = await db.Column.findOne({ where: { id: columnId } });

        if (!column) {
            return { message: 'Column not found' };
        }

        // Lấy boardId từ column để cập nhật Board
        const board = await db.Board.findOne({ where: { id: column.boardId } });

        if (board) {
            // Loại bỏ columnId khỏi columnOrderIds (giả sử là mảng UUIDs)
            const updatedOrder = board.columnOrderIds.filter((uuid) => uuid !== column.uuid);

            // Cập nhật board với columnOrderIds mới
            await db.Board.update({ columnOrderIds: updatedOrder }, { where: { id: column.boardId } });
        }

        // Xóa tất cả các card thuộc columnId
        await db.Card.destroy({
            where: { columnId: columnId },
        });

        // Xóa column
        await db.Column.destroy({
            where: { id: columnId },
        });

        return { message: 'Successfully!' };
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
