import express from 'express';
import cardController from '~/controllers/cardController';
import boardMiddleware from '~/middlewares/boardMiddleware';
import { cardValidation } from '~/validations/cardValidation';

const router = express.Router();

router.get('/', cardController.get);
router.get('/up-next', cardController.getUpNext);
router.get('/:slug', cardController.getOneBySlug);
router.post(
    '/',
    //  boardMiddleware.checkMemberRole('admin', 'owner'),
    cardValidation.store,
    cardController.store,
);
router.put('/:id', boardMiddleware.checkMemberRole('admin', 'owner'), cardValidation.update, cardController.update);
router.put('/:id/update-cover', boardMiddleware.checkMemberRole('admin', 'owner'), cardController.updateCover);
router.delete('/:id', cardValidation.destroy, cardController.destroy);

export default router;
