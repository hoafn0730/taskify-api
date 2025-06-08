'use strict';
const { Model } = require('sequelize');
const { customAlphabet } = require('nanoid');
const { nanoid } = require('nanoid');
const slugify = require('slugify');

// Tạo alphabet chỉ gồm chữ cái và số, loại bỏ các ký tự dễ nhầm lẫn
const customNanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

module.exports = (sequelize, DataTypes) => {
    class Board extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Column, { foreignKey: 'boardId', as: 'columns' });

            this.hasMany(models.WorkspaceBoard, { foreignKey: 'boardId', onDelete: 'CASCADE' });
            this.belongsToMany(models.Workspace, {
                through: models.WorkspaceBoard, // Bảng trung gian
                foreignKey: 'boardId',
                as: 'workspaces',
            });

            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'board' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'members',
            });
        }
    }
    Board.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            type: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            image: DataTypes.STRING,
            shortLink: DataTypes.STRING,
            tags: DataTypes.STRING,
            columnOrderIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            boardCode: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Board',
            paranoid: true,
            hooks: {
                beforeCreate: async (board) => {
                    // Tự động tạo slug nếu chưa có và có title
                    if (!board.slug && board.title) {
                        const generateSlug = async (title) => {
                            const baseSlug = slugify(title, {
                                lower: true,
                                strict: true,
                                locale: 'vi',
                            });

                            let slug = baseSlug;
                            let counter = 1;

                            // Kiểm tra slug trùng lặp trong cả bản ghi đã xóa
                            while (
                                await Board.findOne({
                                    where: { slug },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                })
                            ) {
                                slug = `${baseSlug}-${counter}`;
                                counter++;
                            }

                            return slug;
                        };

                        board.slug = await generateSlug(board.title);
                    }

                    // Tạo shortLink nếu chưa có
                    if (!board.shortLink) {
                        const generateShortLink = async () => {
                            let shortLink;
                            let attempts = 0;
                            const maxAttempts = 5;

                            do {
                                shortLink = nanoid(8); // 8 ký tự random
                                attempts++;

                                // Kiểm tra trong cả bản ghi đã xóa
                                const existingBoard = await Board.findOne({
                                    where: { shortLink },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                });

                                if (!existingBoard) break;
                            } while (attempts < maxAttempts);

                            return shortLink;
                        };

                        board.shortLink = await generateShortLink();
                    }

                    // Tạo mã board tự động nếu chưa có
                    if (!board.boardCode) {
                        const generateBoardCode = async () => {
                            let boardCode;
                            let attempts = 0;
                            const maxAttempts = 5;

                            do {
                                boardCode = `KB${customNanoid()}`; // KB + 6 ký tự random
                                attempts++;

                                // Kiểm tra trong cả bản ghi đã xóa
                                const existingBoard = await Board.findOne({
                                    where: { boardCode },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                });

                                if (!existingBoard) break;
                            } while (attempts < maxAttempts);

                            return boardCode;
                        };

                        board.boardCode = await generateBoardCode();
                        console.log(board.boardCode);
                    }
                },

                // Cập nhật slug khi title thay đổi
                beforeUpdate: async (board) => {
                    if (board.changed('title') && board.title) {
                        const generateSlug = async (title) => {
                            const baseSlug = slugify(title, {
                                lower: true,
                                strict: true,
                                locale: 'vi',
                            });

                            let slug = baseSlug;
                            let counter = 1;

                            // Kiểm tra slug trùng lặp trong cả bản ghi đã xóa (loại trừ bản ghi hiện tại)
                            while (
                                await Board.findOne({
                                    where: {
                                        slug,
                                        id: { [sequelize.Sequelize.Op.ne]: board.id },
                                    },
                                    paranoid: false, // Tìm cả bản ghi đã xóa
                                })
                            ) {
                                slug = `${baseSlug}-${counter}`;
                                counter++;
                            }

                            return slug;
                        };

                        board.slug = await generateSlug(board.title);
                    }
                },

                // Thêm hook để xử lý khi restore bản ghi đã xóa
                beforeRestore: async (board) => {
                    // Kiểm tra xem các trường unique có bị trùng với bản ghi active không
                    const conflicts = await Promise.all([
                        // Kiểm tra slug
                        board.slug
                            ? Board.findOne({
                                  where: {
                                      slug: board.slug,
                                      id: { [sequelize.Sequelize.Op.ne]: board.id },
                                  },
                              })
                            : null,

                        // Kiểm tra boardCode
                        board.boardCode
                            ? Board.findOne({
                                  where: {
                                      boardCode: board.boardCode,
                                      id: { [sequelize.Sequelize.Op.ne]: board.id },
                                  },
                              })
                            : null,

                        // Kiểm tra shortLink
                        board.shortLink
                            ? Board.findOne({
                                  where: {
                                      shortLink: board.shortLink,
                                      id: { [sequelize.Sequelize.Op.ne]: board.id },
                                  },
                              })
                            : null,
                    ]);

                    const [slugConflict, boardCodeConflict, shortLinkConflict] = conflicts;

                    // Tạo lại slug nếu bị trùng
                    if (slugConflict && board.title) {
                        const baseSlug = slugify(board.title, {
                            lower: true,
                            strict: true,
                            locale: 'vi',
                        });

                        let counter = 1;
                        let newSlug = `${baseSlug}-${counter}`;

                        while (await Board.findOne({ where: { slug: newSlug } })) {
                            counter++;
                            newSlug = `${baseSlug}-${counter}`;
                        }

                        board.slug = newSlug;
                    }

                    // Tạo lại boardCode nếu bị trùng
                    if (boardCodeConflict) {
                        let attempts = 0;
                        const maxAttempts = 5;
                        let newBoardCode;

                        do {
                            newBoardCode = `KB${customNanoid()}`;
                            attempts++;

                            const existing = await Board.findOne({
                                where: { boardCode: newBoardCode },
                                paranoid: false,
                            });

                            if (!existing) break;
                        } while (attempts < maxAttempts);

                        board.boardCode = newBoardCode;
                    }

                    // Tạo lại shortLink nếu bị trùng
                    if (shortLinkConflict) {
                        let attempts = 0;
                        const maxAttempts = 5;
                        let newShortLink;

                        do {
                            newShortLink = nanoid(8);
                            attempts++;

                            const existing = await Board.findOne({
                                where: { shortLink: newShortLink },
                                paranoid: false,
                            });

                            if (!existing) break;
                        } while (attempts < maxAttempts);

                        board.shortLink = newShortLink;
                    }
                },
            },
        },
    );
    return Board;
};
