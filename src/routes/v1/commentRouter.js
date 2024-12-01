import express from 'express';
import commentController from '~/controllers/commentController';
import { commentValidation } from '~/validations/commentValidation';

const router = express.Router();

router.get('/', commentController.get);
router.get('/:id', commentController.getOne);
router.post('/', commentValidation.store, commentController.store);
router.put('/:id', commentValidation.update, commentController.update);
router.delete('/:id', commentValidation.destroy, commentController.destroy);

export default router;
