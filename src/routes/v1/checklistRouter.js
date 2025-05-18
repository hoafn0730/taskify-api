import express from 'express';
import checklistController from '~/controllers/checklistController';
import checklistValidation from '~/validations/checklistValidation';

const router = express.Router();

router.post('/', checklistValidation.store, checklistController.store);
router.put('/:id', checklistValidation.update, checklistController.update);
router.delete('/:id', checklistValidation.destroy, checklistController.destroy);

router.post('/:id/items', checklistValidation.storeCheckItem, checklistController.storeCheckItem);
router.put('/:id/items/:checkItemId', checklistValidation.updateCheckItem, checklistController.updateCheckItem);
router.delete('/:id/items/:checkItemId', checklistValidation.destroyCheckItem, checklistController.destroyCheckItem);

export default router;
