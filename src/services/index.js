import db from '~/models';
import createService from '~/utils/createService';
import checkService from './checklistService';

// Tạo service cho từng model
export const commentService = createService(db.Comment);
export const userService = createService(db.User);
export const memberService = createService(db.Member);
export const notificationService = createService(db.Notification);
export const workspaceService = createService(db.Workspace);
export const transactionService = createService(db.Transaction);
export const checklistService = createService(db.Checklist).extends(checkService);
