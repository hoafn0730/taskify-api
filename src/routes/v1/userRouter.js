import express from 'express';
import userController from '~/controllers/userController';
import { userValidation } from '~/validations/userValidation';

const router = express.Router();

router.get('/', userController.get);
router.get('/:id', userController.getOne);
router.post('/', userValidation.store, userController.store);
router.put('/:id', userValidation.update, userController.update);
router.delete('/:id', userValidation.destroy, userController.destroy);

export default router;
