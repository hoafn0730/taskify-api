import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { boardService, memberService, workspaceService } from '~/services';
import db from '~/models';
import { JwtProvider } from '~/providers/JwtProvider';
import { BrevoProvider } from '~/providers/BrevoProvider';
import { NodemailerProvider } from '~/providers/NodemailerProvider';

const get = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const sortBy = req.query.sortBy || 'latest';

        const boards = await boardService.get({
            all: true,
            include: [
                {
                    model: db.Workspace,
                    as: 'workspaces',
                    through: {
                        attributes: ['starred', 'lastView'],
                    },
                    where: { userId: req.user.id },
                    required: false,
                },
                //
                {
                    model: db.User,
                    as: 'members',
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'username', 'email', 'displayName', 'avatar'],
                },
            ],
            attributes: { exclude: ['columnOrderIds'] },
        });

        // ⭐️ Map thêm starred, lastView và sort
        const sortedBoards = boards
            .map((board) => {
                const boardJson = board.toJSON();
                const { workspaces, members, ...rest } = boardJson;

                const starred = !!workspaces?.[0]?.WorkspaceBoard?.starred;
                const lastView = workspaces?.[0]?.WorkspaceBoard?.lastView || new Date();

                // Chuyển Member ra ngoài
                const transformedMembers = members.map((member) => {
                    const { Member, ...userData } = member;
                    return {
                        ...userData,
                        ...Member, // Thêm thông tin từ Member ra ngoài
                    };
                });
                return {
                    ...rest,
                    starred,
                    lastView,
                    members: transformedMembers,
                };
            })
            .sort((a, b) => {
                const starredDiff = Number(b.starred) - Number(a.starred);
                if (starredDiff !== 0) return starredDiff;

                return sortBy === 'latest'
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt);
            });

        // ⚙️ Áp dụng phân trang thủ công sau khi đã sort
        const offset = (page - 1) * pageSize;
        const paginatedBoards = sortedBoards.slice(offset, offset + pageSize);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: {
                total: sortedBoards.length,
                page,
                pageSize,
            },
            data: paginatedBoards,
        });
    } catch (error) {
        next(error);
    }
};

const search = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const query = req.query.q;
        const boards = await boardService.get({
            page,
            pageSize,
            where: {
                title: {
                    [Op.like]: query + '%',
                },
            },
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: boards.meta,
            data: boards.data,
        });
    } catch (error) {
        next(error);
    }
};

const getBoardBySlug = async (req, res, next) => {
    // const userId = req.user.id;

    try {
        const slug = req.params.slug;
        const board = await boardService.getBoardBySlug(slug);

        // const workspace = await workspaceService.getOne({ where: { userId: userId }, raw: true });

        // await db.WorkspaceBoard.upsert(
        //     {
        //         boardId: board.id,
        //         workspaceId: workspace.id,
        //         lastView: new Date(),
        //     },
        //     { workspaceId: workspace.id },
        // );

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const getCombinedBoards = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const workspace = await workspaceService.getOne({
            where: { userId },
            include: [
                {
                    model: db.Board,
                    as: 'boards',
                    through: {
                        as: 'workspaceBoard',
                        attributes: ['lastView'],
                        where: { lastView: { [Op.not]: null } },
                    },
                },
                {
                    model: db.Board,
                    as: 'boardStars',
                    through: { attributes: [], where: { isStarred: true } },
                },
            ],
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const board = await boardService.store({ ...req.body, userId: req.user.id });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const updated = await boardService.update(boardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const deleted = await boardService.destroy(boardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const result = await boardService.moveCardToDifferentColumn(req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const generate = async (req, res, next) => {
    try {
        const board = await boardService.generate(req.body.content);

        if (!board?.message) {
            await memberService.store({
                userId: req.user.id,
                objectId: board.id,
                objectType: 'board',
                role: 'owner',
                active: true,
            });
        }

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const updateBackground = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const updated = await boardService.updateBackground(boardId, req.body.file);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const toggleStarBoard = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const userId = req.user.id;

        // Tìm workspace của user
        const workspace = await db.Workspace.findOne({ where: { userId } });
        if (!workspace) throw new Error('Workspace not found');

        // Tìm mối quan hệ trong bảng trung gian
        const entry = await db.WorkspaceBoard.findOne({
            where: {
                boardId,
                workspaceId: workspace.id,
            },
        });

        if (!entry) throw new Error('Board not linked to this workspace');

        // Toggle giá trị starred
        const updated = await entry.update({ starred: !entry.starred });

        res.status(200).json({
            statusCode: 200,
            message: `Board has been ${updated.starred ? 'starred' : 'unstarred'} successfully!`,
            data: { starred: updated.starred },
        });
    } catch (error) {
        next(error);
    }
};

const invite = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const { inviteEmail } = req.body;

        // Tìm board
        const board = await db.Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Board not found',
            });
        }

        // Tìm user theo email
        const user = await db.User.findOne({
            where: { email: inviteEmail },
            attributes: ['id', 'displayName', 'email'],
        });

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User with this email does not exist',
            });
        }

        const userId = user.id;

        // Kiểm tra nếu đã là member
        const member = await db.Member.findOne({
            where: {
                userId,
                objectId: boardId,
                objectType: 'board',
            },
        });

        if (member) {
            if (member.active) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'User is already a member of this board',
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'User has already been invited but has not accepted yet',
                data: {
                    boardId,
                    userId,
                    status: 'pending',
                },
            });
        }

        // Tạo token mời
        const token = JwtProvider.createToken({ boardId, userId }, '2d');
        const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`;

        // Gửi email mời
        await NodemailerProvider.sendEmail({
            email: 'nguyentiendat39000@gmail.com' || user.email,
            subject: `You've been invited to the board: ${board.title}`,
            htmlContent: `
                <h3>Hello ${'nguyentiendat39000@gmail.com' || user.displayName || user.email},</h3>
                <p>You have been invited to join the board <strong>${board.title}</strong>.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${inviteLink}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Accept Invitation</a>
                <p>This link will expire in 2 days.</p>
            `,
        });

        // Thêm user vào board với active: false (chờ chấp nhận)
        await db.Member.create({
            userId,
            objectId: boardId,
            objectType: 'board',
            active: false,
        });

        return res.status(200).json({
            statusCode: 200,
            message: 'Invitation sent successfully',
            data: {
                boardId,
                userId,
                inviteEmail,
                status: 'pending',
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    get,
    search,
    getBoardBySlug,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
    generate,
    updateBackground,
    getCombinedBoards,
    toggleStarBoard,
    invite,
};
