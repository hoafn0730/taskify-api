import db from '~/models';

const getDetail = async (columnId) => {
    try {
        const data = await db.Column.findOne({ where: { id: columnId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [column, created] = await db.Column.findOrCreate({
            where: { ...data },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: column };
    } catch (error) {
        throw error;
    }
};

const update = async (columnId, data) => {
    try {
        const column = await db.Column.update(
            { ...data },
            {
                where: {
                    id: columnId,
                },
            },
        );

        return column;
    } catch (error) {
        throw error;
    }
};

const destroy = async (columnId) => {
    try {
        const column = await db.Column.destroy({
            where: {
                id: columnId,
            },
        });
        return column;
    } catch (error) {
        throw error;
    }
};

const moveColumn = async (data) => {
    try {
        const prevColumn = await getDetail(data.prevColumnId);
        const nextColumn = await getDetail(data.nextColumnId);
        update(data.prevColumnId, { position: nextColumn.position });
        update(data.nextColumnId, { position: prevColumn.position });

        return { message: 'Successfully' };
    } catch (error) {
        throw error;
    }
};

export default {
    getDetail,
    store,
    update,
    destroy,
    moveColumn,
};
