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

const store = async (data) => {
    try {
        const [card, created] = await db.Card.findOrCreate({
            where: { ...data, uuid: uuidv4(), slug: slugify(data.title, { lower: true }) },
        });

        // Update column
        const column = await db.Column.findOne({ where: { id: data.columnId } });
        column.update({ cardOrderIds: [...column.cardOrderIds, card.uuid] });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return card;
    } catch (error) {
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
        const card = await db.Card.destroy({
            where: {
                id: cardId,
            },
        });
        return card;
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
