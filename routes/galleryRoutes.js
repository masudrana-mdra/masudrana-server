import express from 'express';
import {
  getImages,
  getImage,
  createImage,
  updateImage,
  deleteImage,
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Image routes (Viewing requires login; writing requires admin)
router.route('/images')
  .get(protect, getImages)
  .post(protect, adminOnly, createImage);

router.route('/images/:id')
  .get(protect, getImage)
  .put(protect, adminOnly, updateImage)
  .delete(protect, adminOnly, deleteImage);

// Video routes (Viewing requires login; writing requires admin)
router.route('/videos')
  .get(protect, getVideos)
  .post(protect, adminOnly, createVideo);

router.route('/videos/:id')
  .get(protect, getVideo)
  .put(protect, adminOnly, updateVideo)
  .delete(protect, adminOnly, deleteVideo);

export default router;

