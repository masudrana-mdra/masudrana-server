import express from 'express';
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDocuments)
  .post(protect, adminOnly, createDocument);

router.route('/:id')
  .get(protect, getDocument)
  .put(protect, adminOnly, updateDocument)
  .delete(protect, adminOnly, deleteDocument);

export default router;
