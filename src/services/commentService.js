import db from '~/models';

const getOne = async (commentId) => {
    try {
        const data = await db.Comment.findOne({ where: { id: commentId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [comment, created] = await db.Comment.findOrCreate({
            where: { ...data },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: comment };
    } catch (error) {
        throw error;
    }
};

const update = async (commentId, data) => {
    try {
        const comment = await db.Comment.update(
            { ...data },
            {
                where: {
                    id: commentId,
                },
            },
        );

        return comment;
    } catch (error) {
        throw error;
    }
};

const destroy = async (commentId) => {
    try {
        const comment = await db.Comment.destroy({
            where: {
                id: commentId,
            },
        });

        if (comment) {
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
