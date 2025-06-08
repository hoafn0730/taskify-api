import { StatusCodes } from 'http-status-codes';
import { isEmpty } from 'lodash';
import db from '~/models';
import { boardService, cardService, columnService } from '~/services';
import ApiError from '~/utils/ApiError';

const checkMemberRole = (...roles) => {
    return async (req, res, next) => {
        try {
            // Check if parameters exist
            if (isEmpty(req.params)) {
                return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission!'));
            }

            // Determine boardId based on route type
            let boardId = null;

            // For card routes
            if (req.baseUrl.includes('card')) {
                const card = await cardService.getOne({
                    where: req.params,
                    attributes: ['boardId'], // Optimize by only selecting the boardId
                });

                if (!card) {
                    return next(new ApiError(StatusCodes.NOT_FOUND, 'Card not found!'));
                }

                boardId = card.boardId;
            } else if (req.baseUrl.includes('column')) {
                const column = await columnService.getOne({
                    where: req.params,
                    attributes: ['boardId'],
                });

                if (!column) {
                    return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found!'));
                }

                boardId = column.boardId;
            }
            // For board routes
            else if (req.baseUrl.includes('board')) {
                const board = await boardService.getOne({
                    where: req.params,
                    attributes: ['id'], // Optimize by only selecting the id
                });

                if (!board) {
                    return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found!'));
                }

                boardId = board.id;
            }
            // For any other route types that might be added in the future
            else {
                return next(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid route type!'));
            }

            // Check if user is a member with appropriate role
            const member = await db.Member.findOne({
                where: {
                    userId: req.user.id,
                    objectId: boardId,
                    objectType: 'board',
                },
                attributes: ['role'], // Optimize by only selecting the role
                raw: true,
            });

            // Add board ID to request for potential use in controller
            req.boardId = boardId;

            // Check if user has required role
            if (!member || !roles.includes(member.role)) {
                return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission!'));
            }

            // Add member information to the request for potential use in controller
            req.boardMember = member;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default { checkMemberRole };
