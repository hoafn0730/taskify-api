'use strict';
const { customAlphabet } = require('nanoid');
const { nanoid } = require('nanoid');
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
const slugify = require('slugify');

const customNanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

module.exports = (sequelize, DataTypes) => {
    class Card extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board' });
            this.belongsTo(models.Column, { foreignKey: 'columnId', as: 'column' });
            this.hasMany(models.Checklist, { foreignKey: 'cardId', as: 'checklists' });
            this.hasMany(models.Comment, { foreignKey: 'commentableId', as: 'comments' });

            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'assignees',
            });
            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'card', role: 'reporter' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'reporter',
            });

            this.belongsToMany(models.File, {
                through: {
                    model: models.Attachment,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'fileId',
                constraints: false,
                as: 'attachments',
            });
            this.belongsToMany(models.File, {
                through: {
                    model: models.Attachment,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'fileId',
                constraints: false,
                as: 'cover',
            });
        }
    }
    Card.init(
        {
            boardId: DataTypes.INTEGER,
            columnId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
            shortLink: DataTypes.STRING,
            uuid: DataTypes.STRING,
            dueStart: DataTypes.DATE,
            dueDate: DataTypes.DATE,
            dueComplete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            dueReminder: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
            },
            archivedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            priority: DataTypes.STRING,
            labels: DataTypes.STRING,
            cardCode: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Card',
            paranoid: true,
            hooks: {
                beforeCreate: async (card) => {
                    // Tạo UUID nếu chưa có
                    if (!card.uuid) {
                        card.uuid = uuidv4();
                    }

                    // Tạo shortLink nếu chưa có
                    if (!card.shortLink) {
                        const generateShortLink = async () => {
                            let shortLink;
                            let attempts = 0;
                            const maxAttempts = 5;

                            do {
                                shortLink = nanoid(8);
                                attempts++;

                                // Kiểm tra trong cả bản ghi đã xóa
                                const existingCard = await Card.findOne({
                                    where: { shortLink },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                });

                                if (!existingCard) break;
                            } while (attempts < maxAttempts);

                            return shortLink;
                        };

                        card.shortLink = await generateShortLink();
                    }

                    // Tự động tạo slug nếu chưa có và có title
                    if (!card.slug && card.title) {
                        const generateSlug = async (title) => {
                            const baseSlug = slugify(title, {
                                lower: true,
                                strict: true,
                                locale: 'vi',
                            });

                            let slug = baseSlug;
                            let counter = 1;

                            // Kiểm tra trong cả bản ghi đã xóa
                            while (
                                await Card.findOne({
                                    where: { slug },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                })
                            ) {
                                slug = `${baseSlug}-${counter}`;
                                counter++;
                            }

                            return slug;
                        };

                        card.slug = await generateSlug(card.title);
                    }

                    // Tạo mã card tự động nếu chưa có
                    if (!card.cardCode) {
                        const generateCardCode = async () => {
                            let cardCode;
                            let attempts = 0;
                            const maxAttempts = 5;

                            do {
                                cardCode = `TSK${customNanoid()}`;
                                attempts++;

                                // Kiểm tra trong cả bản ghi đã xóa
                                const existingCard = await Card.findOne({
                                    where: { cardCode },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                });

                                if (!existingCard) break;
                            } while (attempts < maxAttempts);

                            return cardCode;
                        };

                        card.cardCode = await generateCardCode();
                    }
                },

                beforeUpdate: async (card) => {
                    if (card.changed('title') && card.title) {
                        const generateSlug = async (title) => {
                            const baseSlug = slugify(title, {
                                lower: true,
                                strict: true,
                                locale: 'vi',
                            });

                            let slug = baseSlug;
                            let counter = 1;

                            // Kiểm tra trong cả bản ghi đã xóa và loại trừ bản ghi hiện tại
                            while (
                                await Card.findOne({
                                    where: {
                                        slug,
                                        id: { [sequelize.Sequelize.Op.ne]: card.id },
                                    },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                })
                            ) {
                                slug = `${baseSlug}-${counter}`;
                                counter++;
                            }

                            return slug;
                        };

                        card.slug = await generateSlug(card.title);
                    }
                },

                // Thêm hook để xử lý khi restore bản ghi đã xóa
                beforeRestore: async (card) => {
                    // Kiểm tra xem các trường unique có bị trùng với bản ghi active không
                    const conflicts = await Promise.all([
                        // Kiểm tra slug
                        card.slug
                            ? Card.findOne({
                                  where: {
                                      slug: card.slug,
                                      id: { [sequelize.Sequelize.Op.ne]: card.id },
                                  },
                              })
                            : null,

                        // Kiểm tra cardCode
                        card.cardCode
                            ? Card.findOne({
                                  where: {
                                      cardCode: card.cardCode,
                                      id: { [sequelize.Sequelize.Op.ne]: card.id },
                                  },
                              })
                            : null,

                        // Kiểm tra shortLink
                        card.shortLink
                            ? Card.findOne({
                                  where: {
                                      shortLink: card.shortLink,
                                      id: { [sequelize.Sequelize.Op.ne]: card.id },
                                  },
                              })
                            : null,
                    ]);

                    const [slugConflict, cardCodeConflict, shortLinkConflict] = conflicts;

                    // Tạo lại slug nếu bị trùng
                    if (slugConflict && card.title) {
                        const baseSlug = slugify(card.title, {
                            lower: true,
                            strict: true,
                            locale: 'vi',
                        });

                        let counter = 1;
                        let newSlug = `${baseSlug}-${counter}`;

                        while (await Card.findOne({ where: { slug: newSlug } })) {
                            counter++;
                            newSlug = `${baseSlug}-${counter}`;
                        }

                        card.slug = newSlug;
                    }

                    // Tạo lại cardCode nếu bị trùng
                    if (cardCodeConflict) {
                        let attempts = 0;
                        const maxAttempts = 5;
                        let newCardCode;

                        do {
                            newCardCode = `TSK${customNanoid()}`;
                            attempts++;

                            const existing = await Card.findOne({
                                where: { cardCode: newCardCode },
                                paranoid: false,
                            });

                            if (!existing) break;
                        } while (attempts < maxAttempts);

                        card.cardCode = newCardCode;
                    }

                    // Tạo lại shortLink nếu bị trùng
                    if (shortLinkConflict) {
                        let attempts = 0;
                        const maxAttempts = 5;
                        let newShortLink;

                        do {
                            newShortLink = nanoid(8);
                            attempts++;

                            const existing = await Card.findOne({
                                where: { shortLink: newShortLink },
                                paranoid: false,
                            });

                            if (!existing) break;
                        } while (attempts < maxAttempts);

                        card.shortLink = newShortLink;
                    }
                },
            },
        },
    );
    return Card;
};
