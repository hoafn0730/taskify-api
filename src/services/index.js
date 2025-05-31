import db from '~/models';
import createService from '~/utils/createService';
import checklist from './checklistService';
import board from './boardService';
import card from './cardService';
import member from './memberService';

// Tạo service cho từng model
export const cardService = createService(db.Card).extends(card);
export const boardService = createService(db.Board).extends(board);
export const commentService = createService(db.Comment);
export const userService = createService(db.User);
export const notificationService = createService(db.Notification);
export const categoryService = createService(db.Category);
export const postService = createService(db.Post);
export const memberService = createService(db.Member); //.extends(member);

export const workspaceService = createService(db.Workspace);
export const transactionService = createService(db.Transaction);
export const invoiceService = createService(db.Invoice);
export const mailService = createService(db.Mail);
export const eventService = createService(db.Event);
export const checklistService = createService(db.Checklist).extends(checklist);
