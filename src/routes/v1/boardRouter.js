import express from 'express';
import boardController from '~/controllers/boardController';
import { boardValidation } from '~/validations/boardValidation';

const router = express.Router();

router.get('/', boardController.get);
router.get('/:id', boardController.getDetail);
router.post('/', boardValidation.store, boardController.store);
router.put('/:id', boardValidation.update, boardController.update);
router.delete('/:id', boardValidation.destroy, boardController.destroy);

export default router;
