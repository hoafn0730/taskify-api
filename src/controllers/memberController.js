import { StatusCodes } from 'http-status-codes';

import memberService from '~/services/memberService';

const getDetail = async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const members = await memberService.getDetail(memberId);

        res.status(StatusCodes.OK).json({ data: members, member: req.member });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const members = await memberService.store(req.body);
        res.status(StatusCodes.CREATED).json(members);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const memberId = req.params.id;

        const updatedMember = await memberService.update(memberId, req.body);

        res.status(StatusCodes.OK).json(updatedMember);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const memberId = req.params.id;

        const updatedMember = await memberService.destroy(memberId, req.body);

        res.status(StatusCodes.OK).json(updatedMember);
    } catch (error) {
        next(error);
    }
};

export default { getDetail, store, update, destroy };
