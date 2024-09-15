import express from 'express';
import userController from '~/controllers/userController';
import { userValidation } from '~/validations/userValidation';

const router = express.Router();

router.get('/:id', userController.getDetail);
router.post('/', userValidation.store, userController.store);
router.put('/:id', userValidation.update, userController.update);
router.delete('/:id', userValidation.destroy, userController.destroy);

export default router;
