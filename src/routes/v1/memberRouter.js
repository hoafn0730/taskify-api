import express from 'express';
import memberController from '~/controllers/memberController';
import { memberValidation } from '~/validations/memberValidation';

const router = express.Router();

router.get('/', memberController.get);
// router.get('/:id', memberController.getOne);
// router.post('/', memberValidation.store, memberController.store);
router.put('/', memberController.update);
// router.delete('/:id', memberValidation.destroy, memberController.destroy);

export default router;
