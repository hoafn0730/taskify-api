import db from '~/models';
import cloudinary from 'cloudinary';

const cloud_name = 'djcqm9suu';
const api_key = '449557284671453';
const api_secret = 'dhpBRLXN5r2hEr912m3d7sTRSBg';

cloudinary.v2.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
};

const getDetail = async (attachmentId) => {
    try {
        const data = await db.Attachment.findOne({ where: { id: attachmentId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result);
            }
            return reject({ message: error.message });
        });
    });
};

const store = async (data) => {
    try {
        const result = await uploadFile(data.file);

        const attachment = await db.Attachment.create({
            ...data,
            cardId: data.cardId,
            fileUrl: result.secure_url,
            fileType: result.resource_type,
        });

        if (data.cover) {
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

        return { data: attachment };
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
        const attachment = await db.Attachment.destroy({
            where: {
                id: attachmentId,
            },
        });

        if (attachment) {
            return { message: 'Successfully!' };
        }

        return { message: 'Error' };
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
