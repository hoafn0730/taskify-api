import express from 'express';
import cardController from '~/controllers/cardController';
import boardMiddleware from '~/middlewares/boardMiddleware';
import { cardValidation } from '~/validations/cardValidation';

const router = express.Router();

router.get('/', cardController.get);
router.get('/up-next', cardController.getUpNext);
router.get('/:slug', cardController.getOneBySlug);
router.post('/', boardMiddleware.checkMemberRole('admin', 'owner'), cardValidation.store, cardController.store);
router.post('/:cardId/toggle-assignee', cardController.toggleAssignee);
router.post('/:id/files', boardMiddleware.checkMemberRole('admin', 'owner'), cardController.updateFile);
router.put('/:id', boardMiddleware.checkMemberRole('admin', 'owner'), cardValidation.update, cardController.update);

router.delete('/:id/files/:fileId', cardController.deleteFile);

router.delete('/:id', cardValidation.destroy, cardController.destroy);

export default router;
