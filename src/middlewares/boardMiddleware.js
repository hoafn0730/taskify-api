import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { memberService } from '~/services';
import ApiError from '~/utils/ApiError';

const checkMemberRole = (...roles) => {
    return async (req, res, next) => {
        let boardId = req.params.id;
        if (req.body.boardId) {
            boardId = req.body.boardId;
        } else if (!boardId && !req.body.boardId) {
            const card = await db.Card.findOne({
                where: {
                    id: req.body.currentCardId,
                },
                raw: true,
            });

            boardId = card.boardId;
        }

        const member = await memberService.getOne({
            where: { userId: req.user.id, objectId: boardId, objectType: 'board' },
            raw: true,
        });

        if (!member || !roles.includes(member?.role)) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'You have no permission!'));
        }

        next();
    };
};

export default { checkMemberRole };
