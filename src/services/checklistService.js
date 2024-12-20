import db from '~/models';

const storeCheckItem = async (data) => {
    try {
        const checkItem = await db.CheckItem.create(data);

        return checkItem;
    } catch (error) {
        throw error;
    }
};

const updateCheckItem = async (checklistId, checkItemId, data) => {
    try {
        const checkItem = await db.CheckItem.update(
            { ...data },
            {
                where: {
                    id: checkItemId,
                    checklistId: checklistId,
                },
            },
        );

        return checkItem;
    } catch (error) {
        throw error;
    }
};

const destroyCheckItem = async (checklistId, checkItemId) => {
    try {
        const checkItem = await db.CheckItem.destroy({
            where: {
                id: checkItemId,
                checklistId: checklistId,
            },
        });

        if (checkItem) {
            return { message: 'Successfully!' };
        }

        return { message: 'Error' };
    } catch (error) {
        throw error;
    }
};

export default {
    storeCheckItem,
    updateCheckItem,
    destroyCheckItem,
};
