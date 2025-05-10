const createService = (model) => {
    const methods = {
        get: async ({ page = 1, pageSize = 10, where, include = [], all, ...options }) => {
            try {
                const _page = +page;
                const _pageSize = +pageSize;
                const skip = (_page - 1) * _pageSize;
                if (all) {
                    const data = await model.findAll({ where, include, ...options });
                    return data;
                }

                const { count, rows } = await model.findAndCountAll({
                    where,
                    offset: skip,
                    limit: _pageSize,
                    distinct: true,
                    include,
                    ...options,
                });

                return {
                    meta: {
                        page: _page,
                        pageSize: _pageSize,
                        total: count,
                    },
                    data: rows,
                };
            } catch (error) {
                throw error;
            }
        },

        getOne: ({ where, include = [], order = [], ...options }) => {
            try {
                return model.findOne({
                    where: where,
                    include,
                    order,
                    ...options,
                });
            } catch (error) {
                throw error;
            }
        },

        store: async (data, where) => {
            try {
                const [instance, created] = await model.findOrCreate({
                    where: { ...data, ...where },
                    defaults: { ...data },
                });

                if (!created) {
                    return { message: 'Instance already exists!' };
                }

                return instance;
            } catch (error) {
                throw error;
            }
        },

        update: async (id, data) => {
            try {
                const updated = await model.update(
                    { ...data },
                    {
                        where: { id },
                    },
                );

                if (updated[0]) {
                    return model.findOne({ where: { id } });
                } else {
                    return { message: 'Update failed!' };
                }
            } catch (error) {
                throw error;
            }
        },

        destroy: (id) => {
            try {
                return model.destroy({
                    where: { id },
                });
            } catch (error) {
                throw error;
            }
        },
    };

    methods.extends = (customMethods) => {
        return {
            ...methods,
            ...customMethods,
        };
    };

    return methods;
};

export default createService;
