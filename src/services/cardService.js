import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import db from '~/models';

const get = async ({ page = 1, pageSize = 10, where, ...options }) => {
    try {
        const skip = (page - 1) * pageSize;
        const { count, rows } = await db.Card.findAndCountAll({
            where: where,
            offset: skip,
            limit: pageSize,
            distinct: true,
            include: [
                { model: db.Attachment, as: 'cover', required: false },
                { model: db.Attachment, as: 'attachments', required: false },
                {
                    model: db.Checklist,
                    as: 'checklists',
                    required: false,
                    include: [
                        {
                            model: db.CheckItem,
                            as: 'checkItems',
                            required: false,
                        },
                    ],
                },
            ],
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

const getOneBySlug = async (slug, archivedAt) => {
    try {
        const data = await db.Card.findOne({
            where: { slug: slug, archivedAt: archivedAt || null },
            include: [
                { model: db.Board, as: 'board', required: false },
                { model: db.Column, as: 'column', required: false },
                { model: db.Attachment, as: 'attachments', required: false },
                { model: db.Attachment, as: 'cover', required: false },
                {
                    model: db.Comment,
                    as: 'comments',
                    required: false,
                    where: { commentableType: 'card' },
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            required: false,
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                },
                {
                    model: db.Checklist,
                    as: 'checklists',
                    required: false,
                    include: [
                        {
                            model: db.CheckItem,
                            as: 'checkItems',
                            required: false,
                        },
                    ],
                },
            ],
            order: [
                [{ model: db.Checklist, as: 'checklists' }, { model: db.CheckItem, as: 'checkItems' }, 'id', 'ASC'],
            ],
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data, userId) => {
    try {
        // Tạo card mới
        const card = await db.Card.create({
            ...data,
            uuid: uuidv4(),
            slug: slugify(data.title, { lower: true }),
            shortLink: nanoid(8),
        });

        // Cập nhật cardOrderIds trong column tương ứng
        const column = await db.Column.findByPk(data.columnId);

        if (!column) {
            throw new Error('Column not found');
        }

        // Đảm bảo cardOrderIds là mảng
        const currentOrder = Array.isArray(column.cardOrderIds) ? column.cardOrderIds : [];

        await column.update({
            cardOrderIds: [...currentOrder, card.uuid],
        });

        // Gán user là reporter cho card
        await db.Member.create({
            userId,
            objectId: card.id,
            objectType: 'card',
            role: 'reporter',
            active: true,
        });

        return card;
    } catch (error) {
        console.error('Error creating card:', error);
        throw error;
    }
};

const update = async (cardId, data) => {
    try {
        const updated = await db.Card.update(
            { ...data, ...(data.title ? { slug: slugify(data.title, { lower: true }) } : {}) },
            {
                where: {
                    id: cardId,
                },
            },
        );

        if (updated[0]) {
            return db.Card.findOne({ where: { id: cardId } });
        } else {
            return { message: 'error' };
        }
    } catch (error) {
        throw error;
    }
};

const destroy = async (cardId) => {
    try {
        // Tìm card trước khi xóa để biết nó thuộc column nào
        const card = await db.Card.findByPk(cardId);
        if (!card) throw new Error('Card not found');

        const column = await db.Column.findByPk(card.columnId);
        if (!column) throw new Error('Column not found');

        // Loại bỏ cardId khỏi cardOrderIds
        const newCardOrderIds = column.cardOrderIds.filter((uuid) => uuid !== card.uuid);

        // Cập nhật column
        await db.Column.update({ cardOrderIds: newCardOrderIds }, { where: { id: column.id } });

        // Xóa card
        await db.Card.destroy({ where: { id: cardId } });

        return { message: 'Card deleted successfully', cardId };
    } catch (error) {
        throw error;
    }
};

const updateCover = async (cardId, data) => {
    try {
        const updated = await db.Card.update(
            { image: data.image },
            {
                where: {
                    id: cardId,
                },
            },
        );

        if (updated[0]) {
            return db.Card.findOne({ where: { id: cardId } });
        } else {
            return { message: 'error' };
        }
    } catch (error) {
        throw error;
    }
};

export default { get, getOneBySlug, store, update, destroy, updateCover };
