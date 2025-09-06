'use strict';
const { Model } = require('sequelize');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, {
                foreignKey: 'authorId',
                as: 'author',
            });

            // // Polymorphic association với Comment
            // Post.hasMany(models.Comment, {
            //     foreignKey: 'commentableId',
            //     constraints: false,
            //     scope: {
            //         commentableType: 'Post',
            //     },
            //     as: 'comments',
            // });

            // Post.hasMany(models.PostFavorite, {
            //     foreignKey: 'postId',
            //     as: 'favorites',
            // });
        }
    }

    Post.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 255],
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            coverUrl: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: true,
                },
            },
            publish: {
                type: DataTypes.ENUM('draft', 'published', 'archived'),
                defaultValue: 'draft',
            },
            metaTitle: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            metaDescription: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            metaKeywords: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            tags: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            totalViews: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            totalShares: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            totalComments: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            totalFavorites: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Post',
            paranoid: true,
            hooks: {
                beforeCreate: async (post) => {
                    if (!post.slug && post.title) {
                        const baseSlug = slugify(post.title, {
                            lower: true,
                            strict: true,
                            locale: 'vi',
                        });

                        let slug = baseSlug;
                        let counter = 1;

                        while (
                            await Post.findOne({
                                where: { slug },
                                paranoid: false,
                            })
                        ) {
                            slug = `${baseSlug}-${counter}`;
                            counter++;
                        }

                        post.slug = slug;
                    }
                },

                beforeUpdate: async (post) => {
                    if (post.changed('title') && post.title) {
                        const baseSlug = slugify(post.title, {
                            lower: true,
                            strict: true,
                            locale: 'vi',
                        });

                        let slug = baseSlug;
                        let counter = 1;

                        while (
                            await Post.findOne({
                                where: {
                                    slug,
                                    id: { [sequelize.Sequelize.Op.ne]: post.id },
                                },
                                paranoid: false,
                            })
                        ) {
                            slug = `${baseSlug}-${counter}`;
                            counter++;
                        }

                        post.slug = slug;
                    }
                },
            },
        },
    );

    return Post;
};
