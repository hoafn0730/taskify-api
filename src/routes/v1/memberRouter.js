import express from 'express';
import memberController from '~/controllers/memberController';
import { memberValidation } from '~/validations/memberValidation';

const router = express.Router();

router.get('/:id', memberController.getDetail);
router.post('/', memberValidation.store, memberController.store);
router.put('/:id', memberValidation.update, memberController.update);
router.delete('/:id', memberValidation.destroy, memberController.destroy);

export default router;
