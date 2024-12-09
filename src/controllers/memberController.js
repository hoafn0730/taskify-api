import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import db from '~/models';
import { BrevoProvider } from '~/providers/BrevoProvider';
import { memberService } from '~/services';
import boardService from '~/services/boardService';

const getOne = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const members = await memberService.getOne({ id: memberId });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: members,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        // 1, tao member
        const [member, board] = await Promise.all([
            memberService.store({ ...req.body, userId: req.user.id }),
            boardService.getOne(req.body.objectId), // todo: check type object
        ]);

        const { data: admins } = await memberService.get({
            where: {
                objectId: board.id,
                objectType: 'board',
                role: {
                    [Op.or]: ['admin', 'owner'],
                },
            },
            include: { model: db.User, as: 'user' },
        });

        // 2. Gui email accept den admin board xac thuc
        // Todo: sua lai content mail
        const verificationLink = `${process.env.WEBSITE_DOMAIN}/board/${board.slug}`;
        const customSubject = 'Please verify your email before using our services';
        const htmlContent = `
                    <h3>User: ${req.user.email}</h3>
                    <h3>Here is your verification link: </h3>
                    <h3>${verificationLink}</h3>
                `;

        for (const admin of admins) {
            await BrevoProvider.sendEmail(admin.user.email, customSubject, htmlContent);
        }

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
        const memberId = req.params.id;

        const updatedMember = await memberService.update(memberId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedMember,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const memberId = req.params.id;

        const updatedMember = await memberService.destroy(memberId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedMember,
        });
    } catch (error) {
        next(error);
    }
};

export default { getOne, store, update, destroy };
