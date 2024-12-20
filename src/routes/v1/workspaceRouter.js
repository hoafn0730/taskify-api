import express from 'express';
import workspaceController from '~/controllers/workspaceController';
import { workspaceValidation } from '~/validations/workspaceValidation';

const router = express.Router();

router.get('/', workspaceController.get);
router.post('/', workspaceValidation.store, workspaceController.store);
router.put('/:id', workspaceValidation.update, workspaceController.update);
router.delete('/:id', workspaceValidation.destroy, workspaceController.destroy);

export default router;
