import db from '~/models';
import CloudinaryProvider from '~/providers/CloudinaryProvider';

const get = async ({ page = 1, pageSize = 10, where, ...options }) => {
    try {
        const skip = (page - 1) * pageSize;
        const { count, rows } = await db.Attachment.findAndCountAll({
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

const getOne = async (attachmentId) => {
    try {
        const data = await db.Attachment.findOne({ where: { id: attachmentId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const result = await CloudinaryProvider.uploadFile(data.file);

        const attachment = await db.Attachment.create({
            ...data,
            cardId: data.cardId,
            fileUrl: result.secure_url,
            fileType: result.resource_type,
        });

        if (!!data.cover) {
            const card = await db.Card.findOne({ where: { id: data.cardId } });
            db.Card.update(
                { image: attachment.id },
                {
                    where: {
                        id: card.id,
                    },
                },
            );
        }

        return attachment;
    } catch (error) {
        throw error;
    }
};

const update = async (attachmentId, data) => {
    try {
        const attachment = await db.Attachment.update(
            { ...data },
            {
                where: {
                    id: attachmentId,
                },
            },
        );

        return attachment;
    } catch (error) {
        throw error;
    }
};

const destroy = async (attachmentId) => {
    try {
        const attachment = await db.Attachment.findOne({
            where: {
                id: attachmentId,
            },
        });
        await CloudinaryProvider.deleteFile(attachment.fileUrl);

        const deleted = await db.Attachment.destroy({
            where: {
                id: attachmentId,
            },
        });

        if (deleted) {
            return { message: 'Successfully!' };
        }

        return { message: 'Error' };
    } catch (error) {
        throw error;
    }
};

export default { get, getOne, store, update, destroy };
