import express from 'express';
import columnController from '~/controllers/columnController';
import boardMiddleware from '~/middlewares/boardMiddleware';
import { columnValidation } from '~/validations/columnValidation';

const router = express.Router();

router.get('/:id', columnController.getOne);
router.post('/', columnValidation.store, columnController.store);
router.put('/:id', boardMiddleware.checkMemberRole('admin', 'owner'), columnValidation.update, columnController.update);
router.delete('/:id/cards', columnValidation.destroy, columnController.clear);
router.delete('/:id', columnValidation.destroy, columnController.destroy);

export default router;
