import db from '~/models';

const getOne = async (notificationId) => {
    try {
        const data = await db.Notification.findOne({ where: { id: notificationId } });

        return data;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        const [notification, created] = await db.Notification.findOrCreate({
            where: { ...data },
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        return { data: notification };
    } catch (error) {
        throw error;
    }
};

const update = async (notificationId, data) => {
    try {
        const notification = await db.Notification.update(
            { ...data },
            {
                where: {
                    id: notificationId,
                },
            },
        );

        return notification;
    } catch (error) {
        throw error;
    }
};

const destroy = async (notificationId) => {
    try {
        const notification = await db.Notification.destroy({
            where: {
                id: notificationId,
            },
        });

        if (notification) {
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
