import express from 'express';
import cardController from '~/controllers/cardController';
import { cardValidation } from '~/validations/cardValidation';

const router = express.Router();

router.get('/:id', cardController.getDetail);
router.post('/', cardValidation.store, cardController.store);
router.put('/:id', cardValidation.update, cardController.update);
router.delete('/:id', cardValidation.destroy, cardController.destroy);

export default router;
