import { v4 as uuidv4 } from 'uuid';
import db from '~/models';
import { slugify } from '~/utils/formatters';

const get = async ({ page = 1, pageSize = 10, where, ...options }) => {
    try {
        const skip = (page - 1) * pageSize;
        const { count, rows } = await db.Card.findAndCountAll({
            where: where,
            offset: skip,
            limit: pageSize,
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

const getDetailBySlug = async (slug, archivedAt) => {
    try {
        const data = await db.Card.findOne({
            where: { slug: slug, archivedAt: archivedAt || null },
            include: [
                { model: db.Column, as: 'column' },
                { model: db.Attachment, as: 'attachments' },
                { model: db.Attachment, as: 'cover' },
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
            where: { ...data, uuid: uuidv4(), slug: slugify(data.title) },
        });

        // Update column
        const column = await db.Column.findOne({ where: { id: data.columnId } });
        column.update({ cardOrderIds: [...column.cardOrderIds, card.uuid] });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: card };
    } catch (error) {
        throw error;
    }
};

const update = async (cardId, data) => {
    try {
        const updated = await db.Card.update(
            { ...data, slug: slugify(data.title) },
            {
                where: {
                    id: cardId,
                },
            },
        );

        if (updated[0]) {
            const card = await db.Card.findOne({ where: { id: cardId } });

            return card;
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

export default { get, getDetailBySlug, store, update, destroy };
