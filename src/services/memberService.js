import db from '~/models';

const getDetail = async (userId) => {
    try {
        const data = await db.User.findOne({ id: userId });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const user = await db.User.findOne({ where: { uid: +data.userId } });

        const [member, created] = await db.Member.findOrCreate({
            where: { ...data, userId: user.id },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: member };
    } catch (error) {
        throw error;
    }
};

const update = async (memberId, data) => {
    try {
        const member = await db.Member.update(
            { ...data },
            {
                where: {
                    id: memberId,
                },
            },
        );

        return member;
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
