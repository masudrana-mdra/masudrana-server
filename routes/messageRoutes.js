import express from 'express';
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createMessage) // Public contact form submission
  .get(protect, adminOnly, getMessages); // Admin inbox fetch

router.route('/:id')
  .get(protect, adminOnly, getMessage)
  .put(protect, adminOnly, updateMessageStatus)
  .delete(protect, adminOnly, deleteMessage);

export default router;

