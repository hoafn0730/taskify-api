import express from 'express';
import categoryController from '~/controllers/categoryController';
import { categoryValidation } from '~/validations/categoryValidation';

const router = express.Router();

router.get('/', categoryController.get);
router.get('/:id', categoryController.getOne);
router.post('/', categoryValidation.store, categoryController.store);
router.put('/:id', categoryValidation.update, categoryController.update);
router.delete('/:id', categoryValidation.destroy, categoryController.destroy);

export default router;
