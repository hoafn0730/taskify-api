import express from 'express';
import checklistController from '~/controllers/checklistController';
import checklistValidation from '~/validations/checklistValidation';

const router = express.Router();

router.get('/:slug', checklistController.getDetailBySlug);
router.post('/', checklistValidation.store, checklistController.store);
router.put('/:id/checkitems/:checkItemId', checklistValidation.updateCheckItem, checklistController.updateCheckItem);
router.put('/:id', checklistValidation.update, checklistController.update);
router.delete('/:id', checklistValidation.destroy, checklistController.destroy);

export default router;
