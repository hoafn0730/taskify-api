import express from 'express';
import boardController from '~/controllers/boardController';
import { boardValidation } from '~/validations/boardValidation';

const router = express.Router();

router.get('/', boardController.get);
router.get('/:id', boardController.getOne);
router.get('/:slug', boardController.getBoardBySlug);
router.post('/', boardValidation.store, boardController.store);
router.put('/:id', boardValidation.update, boardController.update);
router.delete('/:id', boardValidation.destroy, boardController.destroy);

router.put(
    '/supports/moving_card',
    boardValidation.moveCardToDifferentColumn,
    boardController.moveCardToDifferentColumn,
);

export default router;
