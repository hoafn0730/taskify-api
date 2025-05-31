import express from 'express';
import teamController from '~/controllers/teamController';
import { teamValidation } from '~/validations/teamValidation';

const router = express.Router();

// router.get('/', teamController.get);
router.get('/:id', teamController.getOne);
// router.post('/', teamValidation.store, teamController.store);
// router.put('/:id', teamValidation.update, teamController.update);
// router.delete('/:id', teamValidation.destroy, teamController.destroy);

export default router;
