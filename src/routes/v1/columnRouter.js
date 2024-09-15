import express from 'express';
import columnController from '~/controllers/columnController';
import { columnValidation } from '~/validations/columnValidation';

const router = express.Router();

router.put('/moving_column', columnValidation.moveColumn, columnController.moveColumn);

router.get('/:id', columnController.getDetail);
router.post('/', columnValidation.store, columnController.store);
router.put('/:id', columnValidation.update, columnController.update);
router.delete('/:id', columnValidation.destroy, columnController.destroy);

export default router;
