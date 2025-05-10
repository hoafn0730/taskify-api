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
        const data = await db.Board.findOne({
            where: { slug },
            include: [
                {
                    model: db.Column,
                    as: 'columns',
                },
                {
                    model: db.Member,
                    as: 'members',
                    include: { model: db.User, as: 'user' },
                },
            ],
        });

        const cards = await db.Card.findAll({
            where: { boardId: data.id },
            include: [
                { model: db.Attachment, as: 'cover' },
                { model: db.Attachment, as: 'attachments' },
                { model: db.Comment, as: 'comments' },
                { model: db.Member, as: 'assignee' },
                {
                    model: db.Checklist,
                    as: 'checklists',
                    include: [
                        {
                            model: db.CheckItem,
                            as: 'checkItems',
                        },
                    ],
                },
            ],
        });

        // Tạo map từ columnId -> columnUUID
        const columnIdToUUIDMap = Object.fromEntries(data.columns.map((col) => [col.id, col.uuid]));

        // Group cards theo columnUUID
        const cardsByColumnUUID = _.groupBy(cards, (card) => columnIdToUUIDMap[card.columnId]);

        // Gán vào data với key là tasks
        const plainData = data.toJSON();
        // Đảm bảo column nào cũng có array (kể cả column không có card)
        plainData.tasks = {};
        for (const col of data.columns) {
            const columnUUID = col.uuid;
            plainData.tasks[columnUUID] = cardsByColumnUUID[columnUUID] || [];
        }

        return plainData;
    } catch (error) {
        throw error;
    }
};

const store = async (data) => {
    try {
        // Tạo board mới
        const [board, created] = await db.Board.findOrCreate({
            where: {
                ...data,
                slug: slugify(data.title, { lower: true }),
                shortLink: nanoid(8),
            },
        });

        if (!created) {
            return { message: 'Instance already exists!' };
        }

        // [ ]: workspace
        // Lấy workspace tương ứng
        //         const workspace = await db.Workspace.findByPk(data.workspaceId);
        //
        //         if (!workspace) {
        //             throw new Error('Workspace not found');
        //         }
        //
        //         // Thêm board vào workspace (tự động thêm vào bảng WorkspaceBoard)
        //         await workspace.addBoard(board, {
        //             through: {
        //                 starred: false, // Giá trị mặc định
        //                 lastView: new Date(), // Giá trị mặc định
        //             },
        //         });

        return board;
    } catch (error) {
        console.log('🚀 ~ store ~ error:', error);
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
