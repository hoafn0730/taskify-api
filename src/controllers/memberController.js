import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { memberService } from '~/services';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const type = req.query.type;
        const id = req.query.id;
        const members = await memberService.get({
            page,
            pageSize,
            where: { objectId: id, objectType: type },

            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'email', 'username', 'displayName', 'avatar'],
                },
            ],
            raw: true,
            nest: true,
        });

        // Transform data to flatten user properties
        const transformedData = members.data.map((member) => ({
            id: member.id,
            objectId: member.objectId,
            objectType: member.objectType,
            userId: member.userId,
            role: member.role,
            active: Buffer.isBuffer(member.active) ? member.active[0] === 1 : false,
            email: member.user.email,
            username: member.user.username,
            displayName: member.user.displayName,
            avatar: member.user.avatar,
            createdAt: member.createdAt,
        }));

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: { ...members, data: transformedData },
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const member = await memberService.getOne({ where: { id: memberId } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const member = await memberService.store(req.body);

        res.io.emit('notification', {
            message: 'hello',
        });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        await db.Member.update(req.body, {
            where: { userId: req.body.userId, objectId: req.body.objectId, objectType: req.body.objectType },
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const memberId = req.params.id;

        const deleted = await memberService.destroy(memberId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOne, store, update, destroy };
