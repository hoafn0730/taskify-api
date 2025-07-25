import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import _ from 'lodash';

import db from '~/models';
import columnService from './columnService';
import cardService from './cardService';
import { mapOrder } from '~/utils/sorts';
import CloudinaryProvider from '~/providers/CloudinaryProvider';
import GeminiProvider from '~/providers/GeminiProvider';

const getBoardBySlug = async (slug) => {
    try {
        // 1. Lấy thông tin bảng (board) theo slug, bao gồm các cột (columns) và thành viên (members)
        const board = await db.Board.findOne({
            where: { slug },
            include: [
                {
                    model: db.Column,
                    as: 'columns',
                },
                {
                    model: db.User,
                    as: 'members',
                    through: {
                        attributes: ['role', 'active'], // Không lấy thuộc tính trung gian từ bảng Member
                    },
                    attributes: ['id', 'username', 'email', 'displayName', 'avatar'], // Chỉ lấy một số trường cần thiết
                },
            ],
        });

        // 2. Lấy tất cả các thẻ (cards) thuộc board đó
        const cards = await db.Card.findAll({
            where: { boardId: board.id },
            include: [
                {
                    model: db.File,
                    as: 'cover', // Lấy file cover (có thể sẽ không dùng nếu lọc cover thủ công)
                    through: { attributes: [] },
                },
                {
                    model: db.File,
                    as: 'attachments', // Lấy tất cả các tệp đính kèm
                    through: { attributes: [] },
                },
                {
                    model: db.Comment,
                    as: 'comments', // Lấy tất cả comment trong card
                },
                {
                    model: db.User,
                    as: 'assignees', // Người được giao nhiệm vụ
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'username', 'email', 'displayName', 'avatar'],
                },
                {
                    model: db.User,
                    as: 'reporter', // Người tạo nhiệm vụ
                    attributes: ['id', 'username', 'email', 'displayName', 'avatar'],
                    through: { attributes: [] },
                },
                {
                    model: db.Checklist,
                    as: 'checklists', // Lấy checklist và các item con
                    separate: true,
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: db.CheckItem,
                            as: 'items',
                            separate: true,
                            order: [['createdAt', 'ASC']],
                        },
                    ],
                },
            ],
        });

        // 3. Gán file cover vào mỗi card (cover là attachment có id trùng với card.image)
        const result = cards.map((card) => {
            const cover = card.attachments.find((file) => file.id === card.image);
            return {
                ...card.toJSON(),
                cover, // Gán cover vào object trả về
            };
        });

        // 4. Tạo map từ columnId sang columnUUID để dễ xử lý
        const columnIdToUUIDMap = Object.fromEntries(board.columns.map((col) => [col.id, col.uuid]));

        // 5. Gom nhóm các card theo columnUUID
        const cardsByColumnUUID = _.groupBy(result, (card) => columnIdToUUIDMap[card.columnId]);

        // 6. Tạo object `tasks` chứa danh sách card theo từng cột (theo UUID)
        const plainData = board.toJSON();
        plainData.tasks = {};
        for (const col of board.columns) {
            const columnUUID = col.uuid;
            plainData.tasks[columnUUID] = cardsByColumnUUID[columnUUID] || []; // Nếu cột không có card thì gán mảng rỗng
        }

        plainData.members = plainData.members.map(({ Member, ...member }) => ({
            ...member,
            role: Member.role,
            active: Member.active,
        }));

        // 7. Trả về dữ liệu board đầy đủ (columns, members, cards group theo column)
        return plainData;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    const transaction = await db.sequelize.transaction();

    try {
        // 1. Validate input data
        if (!data.title || !data.userId) {
            throw new Error('Title and userId are required');
        }

        // 2. Chuẩn bị dữ liệu board
        const boardData = {
            title: data.title,
            description: data.description || '',
            type: data.type || 'kanban',
            tags: Array.isArray(data.tags) ? data.tags.join(',') : '',
        };

        // 3. Upload ảnh nếu có (bất đồng bộ)
        let imageUploadPromise = null;
        if (data.image) {
            imageUploadPromise = CloudinaryProvider.uploadFile(data.image);
        }

        // 4. Tìm workspace song song với upload ảnh
        const workspacePromise = db.Workspace.findOne({
            where: { userId: data.userId },
            transaction,
        });

        // 5. Chờ các promises hoàn thành
        const [imageResult, workspace] = await Promise.all([imageUploadPromise, workspacePromise]);

        if (!workspace) {
            throw new Error('Workspace not found');
        }

        // 6. Thêm URL ảnh vào boardData nếu có
        if (imageResult) {
            boardData.image = imageResult.secure_url;
        }

        // 7. Tạo board với where condition để tránh trùng lặp
        const [board, created] = await db.Board.findOrCreate({
            where: {
                title: data.title,
                // Có thể thêm điều kiện khác để tránh trùng lặp
                // userId: data.userId // nếu board thuộc về user cụ thể
            },
            defaults: boardData,
            transaction,
        });

        if (!created) {
            await transaction.rollback();
            return {
                success: false,
                message: 'Board with this title already exists!',
                board: null,
            };
        }

        // 8. Chuẩn bị member data
        const uniqueMembers = data.members ? [...new Set(data.members)].filter((id) => id !== data.userId && id) : [];

        const memberData = [
            // Owner
            {
                userId: data.userId,
                role: 'owner',
                objectId: board.id,
                objectType: 'board',
                active: true,
            },
            // Other members
            ...uniqueMembers.map((userId) => ({
                userId,
                role: 'member', // Thêm role mặc định
                objectId: board.id,
                objectType: 'board',
                active: true,
            })),
        ];

        // 9. Thực hiện các operations song song
        const [members] = await Promise.all([
            // Tạo members
            db.Member.bulkCreate(memberData, {
                transaction,
                ignoreDuplicates: true, // Bỏ qua nếu đã tồn tại
            }),

            // Thêm board vào workspace
            db.WorkspaceBoard.create(
                {
                    workspaceId: workspace.id,
                    boardId: board.id,
                    starred: false,
                    lastView: new Date(),
                },
                { transaction },
            ),
        ]);

        await transaction.commit();

        // 10. Trả về board với thông tin đầy đủ
        const fullBoard = await db.Board.findByPk(board.id, {
            include: [
                {
                    model: db.User,
                    as: 'members',
                    attributes: ['id', 'displayName', 'email', 'avatar'],
                    through: { attributes: ['role', 'active'] },
                },
            ],
        });

        return {
            success: true,
            message: 'Board created successfully',
            board: fullBoard,
        };
    } catch (error) {
        await transaction.rollback();

        // Log error for debugging
        console.error('Error creating board:', error);

        throw error;
    }
};

const update = async (boardId, data) => {
    try {
        const board = await db.Board.update(
            { ...data, ...(data.title ? { slug: slugify(data.title, { lower: true }) } : {}) },
            {
                where: {
                    id: boardId,
                },
            },
        );

        return board;
    } catch (error) {
        throw error;
    }
};

const destroy = async (boardId) => {
    try {
        const board = await db.Board.destroy({
            where: {
                id: boardId,
            },
        });
        return board;
    } catch (error) {
        throw error;
    }
};

const moveCardToDifferentColumn = async (data) => {
    try {
        // Cap nhat mang cardOrderIds trong column bau dau
        await columnService.update(data.prevColumnId, {
            cardOrderIds: data.prevCardOrderIds,
        });

        // Cap nhat mang cardOrderIds trong column moi
        await columnService.update(data.nextColumnId, {
            cardOrderIds: data.nextCardOrderIds,
        });

        const card = await db.Card.findOne({ where: { id: data.currentCardId } });

        // Cap nhat truong columnId moi
        await cardService.update(data.currentCardId, {
            columnId: data.nextColumnId,
            title: card.title,
        });

        return { message: 'Successfully' };
    } catch (error) {
        throw error;
    }
};

const generate = async (content) => {
    try {
        // * B1: Tao content tu goi y
        const data = await GeminiProvider.googleAIGenerate(content);

        // * B2: Tao board tu content da tao
        // * Tao board
        const [board, created] = await db.Board.findOrCreate({
            where: {
                title: data.title,
                slug: slugify(data.title, { lower: true }),
            },
            defaults: {
                description: data.description,
                type: data.type,
            },
            raw: true,
        });

        if (!created) {
            return { message: 'Instance was exist!' };
        }

        // * B3: Tao nhieu column cua board vua tao
        const orderedColumns = mapOrder(data.columns, data.columnOrderIds, 'uuid');

        const columns = await db.Column.bulkCreate(
            orderedColumns.map((col) => ({
                ...col,
                boardId: board.id,
                uuid: uuidv4(),
                slug: slugify(col.title, { lower: true }),
            })),
            { raw: true },
        );

        await update(board.id, { columnOrderIds: columns.map((col) => col.uuid) });

        const allCards = [];
        for (const [index, col] of columns.entries()) {
            const orderedCards = mapOrder(data.columns[index].cards, data.columns[index].cardOrderIds, 'uuid').map(
                (card) => ({
                    ...card,
                    boardId: board.id,
                    columnId: col.id,
                    uuid: uuidv4(),
                    slug: slugify(card.title, { lower: true }),
                }),
            );
            allCards.push(...orderedCards);
        }

        // * Tạo tất cả thẻ trong một lần
        const cards = await db.Card.bulkCreate(allCards, { raw: true });

        // * Cập nhật cardOrderIds trong các cột
        const updateColumnsPromises = columns.map((column) =>
            columnService.update(column.id, {
                cardOrderIds: cards.filter((card) => card.columnId === column.id).map((card) => card.uuid),
            }),
        );
        await Promise.all(updateColumnsPromises);

        return board;
    } catch (error) {
        throw error;
    }
};

const updateBackground = async (boardId, data) => {
    try {
        let board = await db.Board.findOne({ where: { id: boardId }, raw: true });

        const result = await CloudinaryProvider.uploadFile(data);
        const updated = await db.Board.update(
            { image: result.secure_url },
            {
                where: {
                    id: boardId,
                },
            },
        );

        if (!updated[0]) return;
        await CloudinaryProvider.deleteFile(CloudinaryProvider.extractPublicId(board.image));
        board.image = result.secure_url;

        return board;
    } catch (error) {
        throw error;
    }
};

export default {
    getBoardBySlug,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
    generate,
    updateBackground,
};
