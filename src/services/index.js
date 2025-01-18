import db from '~/models';
import createService from '~/utils/createService';
import checklist from './checklistService';
import board from './boardService';
import card from './cardService';

// Tạo service cho từng model
export const cardService = createService(db.Card).extends(card);
export const boardService = createService(db.Board).extends(board);
export const commentService = createService(db.Comment);
export const userService = createService(db.User);
export const memberService = createService(db.Member);
export const notificationService = createService(db.Notification);
export const workspaceService = createService(db.Workspace);
export const transactionService = createService(db.Transaction);
export const checklistService = createService(db.Checklist).extends(checklist);
