import express from 'express';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, adminOnly, createSkill);

router.route('/:id')
  .get(getSkill)
  .put(protect, adminOnly, updateSkill)
  .delete(protect, adminOnly, deleteSkill);

export default router;

