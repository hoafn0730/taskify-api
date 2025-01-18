import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import db from '~/models';
import { BrevoProvider } from '~/providers/BrevoProvider';
import { memberService } from '~/services';
import boardService from '~/services/boardService';

const getOne = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const members = await memberService.getOne({ where: { id: memberId } });

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
            boardService.getOne({ where: { id: req.body.objectId } }), // * check type object
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

        // 2. Gui email xac thuc
        if (board.type === 'public') {
            const verificationLink = `${process.env.WEBSITE_DOMAIN}/board/${board.slug}`;
            const customSubject = 'You have successfully joined the board!';
            const htmlContent = `
                <h3>Congratulations, ${req.user.email}!</h3>
                <p>You have successfully joined the board. Here is your board link:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p>Click the link above to access the board and start participating.</p>
                `;
            await BrevoProvider.sendEmail(req.user.email, customSubject, htmlContent);
        } else {
            const verificationLink = `${process.env.WEBSITE_DOMAIN}/board/${board.slug}`;
            const customSubject = 'New request to join the board - Action required';
            const htmlContent = `
                <h3>A new user has requested to join the board:</h3>
                <h4>User email: ${req.user.email}</h4>
                <p>Click the link below to review and accept the request:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p>Please take the necessary action to approve or deny the request.</p>
                `;
            for (const admin of admins) {
                await BrevoProvider.sendEmail(admin.user.email, customSubject, htmlContent);
            }
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
        const updated = await memberService.update(memberId, req.body);

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

export default { getOne, store, update, destroy };
