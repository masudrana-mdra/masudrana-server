import express from 'express';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getArticles)
  .post(protect, adminOnly, createArticle);

router.route('/:id')
  .get(getArticle)
  .put(protect, adminOnly, updateArticle)
  .delete(protect, adminOnly, deleteArticle);

export default router;

