import db from '~/models';

const getOne = async (memberId) => {
    try {
        const data = await db.Member.findOne({ where: { id: memberId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [member, created] = await db.Member.findOrCreate({
            where: { ...data },
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

const destroy = async (memberId) => {
    try {
        const member = await db.Member.destroy({
            where: {
                id: memberId,
            },
        });
        return member;
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
