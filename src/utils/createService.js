const createService = (model, options = {}) => ({
    get: async ({ page = 1, pageSize = 10, where, include = [], ...additionalOptions }) => {
        try {
            const skip = (page - 1) * pageSize;
            const { count, rows } = await model.findAndCountAll({
                where,
                offset: skip,
                limit: pageSize,
                distinct: true,
                include,
                ...additionalOptions,
            });

            return {
                meta: {
                    page,
                    pageSize,
                    total: count,
                },
                data: rows,
            };
        } catch (error) {
            throw error;
        }
    },

    getOne: async (conditions, include = [], order = []) => {
        try {
            return await model.findOne({
                where: conditions,
                include,
                order,
            });
        } catch (error) {
            throw error;
        }
    },

    store: async (data, uniqueCondition = {}) => {
        try {
            const [instance, created] = await model.findOrCreate({
                where: { ...data },
                defaults: { ...data },
            });

            if (!created) {
                return { message: 'Instance already exists!' };
            }

            return { data: instance };
        } catch (error) {
            throw error;
        }
    },

    update: async (id, data, uniqueCondition = {}) => {
        try {
            const updated = await model.update(
                { ...data },
                {
                    where: { id, ...uniqueCondition },
                },
            );

            if (updated[0]) {
                return await model.findOne({ where: { id } });
            } else {
                return { message: 'Update failed!' };
            }
        } catch (error) {
            throw error;
        }
    },

    destroy: async (conditions) => {
        try {
            return await model.destroy({
                where: conditions,
            });
        } catch (error) {
            throw error;
        }
    },
});

export default createService;
