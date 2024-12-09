import db from '~/models';

const getOne = async (checklistId) => {
    try {
        const data = await db.Checklist.findOne({ where: { id: checklistId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [checklist, created] = await db.Checklist.findOrCreate({
            where: { ...data },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return checklist;
    } catch (error) {
        throw error;
    }
};

const update = async (checklistId, data) => {
    try {
        const checklist = await db.Checklist.update(
            { ...data },
            {
                where: {
                    id: checklistId,
                },
            },
        );

        return checklist;
    } catch (error) {
        throw error;
    }
};

const destroy = async (checklistId) => {
    try {
        const checklist = await db.Checklist.destroy({
            where: {
                id: checklistId,
            },
        });

        if (checklist) {
            return { message: 'Successfully!' };
        }

        return { message: 'Error' };
    } catch (error) {
        throw error;
    }
};

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
    getOne,
    store,
    update,
    destroy,
    storeCheckItem,
    updateCheckItem,
    destroyCheckItem,
};
