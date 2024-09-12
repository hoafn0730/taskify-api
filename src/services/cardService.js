import db from '~/models';

const getDetail = async (cardId) => {
    try {
        const data = await db.Card.findOne({ id: cardId });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [card, created] = await db.Card.findOrCreate({
            where: { ...data },
        });

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
        const card = await db.Card.update(
            { ...data },
            {
                where: {
                    id: cardId,
                },
            },
        );

        return card;
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

export default {
    getDetail,
    store,
    update,
    destroy,
};
