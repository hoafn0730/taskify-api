import db from '~/models';

const getDetail = async (userId) => {
    try {
        const data = await db.User.findOne({ where: { id: userId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [user, created] = await db.User.findOrCreate({
            where: { ...data },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: user };
    } catch (error) {
        throw error;
    }
};

const update = async (userId, data) => {
    try {
        const user = await db.User.update(
            { ...data },
            {
                where: {
                    id: userId,
                },
            },
        );

        return user;
    } catch (error) {
        throw error;
    }
};

const destroy = async (userId) => {
    try {
        const user = await db.User.destroy({
            where: {
                id: userId,
            },
        });
        return user;
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
