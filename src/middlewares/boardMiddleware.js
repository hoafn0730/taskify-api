import { StatusCodes } from 'http-status-codes';
import { isEmpty } from 'lodash';
import { boardService, cardService, memberService } from '~/services';
import ApiError from '~/utils/ApiError';

const checkMemberRole = (...roles) => {
    return async (req, res, next) => {
        try {
            if (isEmpty(req.params)) {
                return next(new ApiError(StatusCodes.FORBIDDEN, 'You does not have permission!'));
            }

            let boardId = null;
            const board = await boardService.getOne({ where: req.params });
            if (board) {
                boardId = board.id;
            } else {
                const card = await cardService.getOne({
                    where: req.params,
                });
                boardId = card.boardId;
            }

            if (!boardId) {
                return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found!'));
            }

            const member = await memberService.getOne({
                where: { userId: req.user.id, objectId: boardId, objectType: 'board' },
                raw: true,
            });

            if (!member || !roles.includes(member?.role)) {
                return next(new ApiError(StatusCodes.FORBIDDEN, 'You does not have permission!'));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default { checkMemberRole };
