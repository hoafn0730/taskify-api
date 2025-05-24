import express from 'express';
import calendarController from '~/controllers/calendarController';
import { calendarValidation } from '~/validations/calendarValidation';

const router = express.Router();

router.get('/', calendarController.get);
router.post('/', calendarValidation.store, calendarController.store);
router.put('/:id', calendarValidation.update, calendarController.update);
router.delete('/:id', calendarValidation.destroy, calendarController.destroy);

export default router;
