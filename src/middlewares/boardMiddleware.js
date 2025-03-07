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
            if (req.baseUrl.includes('card')) {
                const card = await cardService.getOne({
                    where: req.params,
                });
                boardId = card.boardId;
            } else if (req.baseUrl.includes('board')) {
                const board = await boardService.getOne({ where: req.params });
                boardId = board.id;
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
