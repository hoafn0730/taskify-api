import express from 'express';
import notificationController from '~/controllers/notificationController';
import { notificationValidation } from '~/validations/notificationValidation';

const router = express.Router();

router.get('/:id', notificationController.getOne);
router.post('/', notificationValidation.store, notificationController.store);
router.put('/:id', notificationValidation.update, notificationController.update);
router.delete('/:id', notificationValidation.destroy, notificationController.destroy);

export default router;
