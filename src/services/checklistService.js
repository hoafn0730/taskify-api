import db from '~/models';

const store = async (data) => {
    try {
        const checklist = await db.Checklist.create({
            cardId: data.cardId,
            title: data.title,
        });

        // Nếu có copyFrom thì sao chép items
        if (data.copyFrom) {
            const sourceChecklist = await db.Checklist.findByPk(data.copyFrom, {
                include: [{ model: db.CheckItem, as: 'items' }],
            });

            if (sourceChecklist && sourceChecklist.items.length > 0) {
                const copiedItems = sourceChecklist.items.map((item) => ({
                    checklistId: checklist.id,
                    title: item.title,
                    status: item.status,
                }));

                await db.CheckItem.bulkCreate(copiedItems);
            }
        }

        // Truy vấn lại checklist kèm checkItems vừa được tạo
        const fullChecklist = await db.Checklist.findByPk(checklist.id, {
            include: [{ model: db.CheckItem, as: 'items' }],
        });

        return fullChecklist;
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

export default { store, storeCheckItem, updateCheckItem, destroyCheckItem };
