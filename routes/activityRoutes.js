import express from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(protect, adminOnly, createActivity);

router.route('/:id')
  .get(getActivity)
  .put(protect, adminOnly, updateActivity)
  .delete(protect, adminOnly, deleteActivity);

export default router;

