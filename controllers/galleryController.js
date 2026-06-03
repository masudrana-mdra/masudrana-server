import mongoose from 'mongoose';
import Image from '../models/Image.js';
import Video from '../models/Video.js';

const normalizeImagePayload = (body) => ({
  title: body.title || body.description || 'Untitled image',
  url: body.url || body.imageUrl,
  category: body.category || 'Gallery',
  description: body.description || '',
  featured: Boolean(body.featured),
  cameraInfo: body.cameraInfo || '',
  resolution: body.resolution || '',
  customLabels: body.customLabels || '',
  tags: Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map(t => t.trim()) : []),
});

const normalizeVideoPayload = (body) => {
  const url = body.url || body.videoUrl;
  return {
    title: body.title,
    url,
    platform: body.platform || (String(url || '').includes('drive.google.com') ? 'GoogleDrive' : 'YouTube'),
    description: body.description || '',
    thumbnail: body.thumbnail || '',
    featured: Boolean(body.featured),
    duration: body.duration || '',
    videoQuality: body.videoQuality || '1080p',
    sourceType: body.sourceType || 'YouTube',
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map(t => t.trim()) : []),
  };
};

// --- IMAGE CONTROLLERS ---

// @desc    Get all images
// @route   GET /api/gallery/images
// @access  Private (Logged In Users Only)
export const getImages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const images = await Image.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new image
// @route   POST /api/gallery/images
// @access  Private/Admin
export const createImage = async (req, res, next) => {
  try {
    const image = await Image.create(normalizeImagePayload(req.body));
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image
// @route   PUT /api/gallery/images/:id
// @access  Private/Admin
export const updateImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = await Image.findByIdAndUpdate(id, normalizeImagePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/gallery/images/:id
// @access  Private/Admin
export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};


// --- VIDEO CONTROLLERS ---

// @desc    Get all videos
// @route   GET /api/gallery/videos
// @access  Private (Logged In Users Only)
export const getVideos = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new video
// @route   POST /api/gallery/videos
// @access  Private/Admin
export const createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(normalizeVideoPayload(req.body));
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video
// @route   PUT /api/gallery/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const video = await Video.findByIdAndUpdate(id, normalizeVideoPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/gallery/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single image
// @route   GET /api/gallery/images/:id
// @access  Private
export const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video
// @route   GET /api/gallery/videos/:id
// @access  Private
export const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};
