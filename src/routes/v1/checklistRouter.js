import express from 'express';
import checklistController from '~/controllers/checklistController';
import checklistValidation from '~/validations/checklistValidation';

const router = express.Router();

router.get('/:slug', checklistController.getOneBySlug);
router.post('/', checklistValidation.store, checklistController.store);
router.put('/:id', checklistValidation.update, checklistController.update);
router.delete('/:id', checklistValidation.destroy, checklistController.destroy);

router.post('/:id/check-items', checklistValidation.storeCheckItem, checklistController.storeCheckItem);
router.put('/:id/check-items/:checkItemId', checklistValidation.updateCheckItem, checklistController.updateCheckItem);
router.delete(
    '/:id/check-items/:checkItemId',
    checklistValidation.destroyCheckItem,
    checklistController.destroyCheckItem,
);

export default router;
