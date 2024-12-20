import { StatusCodes } from 'http-status-codes';
import { memberService } from '~/services';
import ApiError from '~/utils/ApiError';

const checkMemberRole = (...roles) => {
    return async (req, res, next) => {
        const boardId = req.params.id;
        const member = await memberService.getOne({
            where: { userId: req.user.id, objectId: boardId, objectType: 'board' },
            raw: true,
        });

        if (!member && !roles.some((role) => role.includes(member?.role))) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'You have no permission!'));
        }

        next();
    };
};

export default { checkMemberRole };
