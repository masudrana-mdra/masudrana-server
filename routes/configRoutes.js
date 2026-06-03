import express from 'express';
import {
  getConfigs,
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig,
} from '../controllers/configController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getConfigs)
  .post(protect, adminOnly, createConfig);

router.route('/:key')
  .get(getConfig)
  .put(protect, adminOnly, updateConfig)
  .delete(protect, adminOnly, deleteConfig);

export default router;
