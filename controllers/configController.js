import mongoose from 'mongoose';
import { z } from 'zod';
import Config from '../models/Config.js';

// Zod schemas for config validation
const configSchema = z.object({
  key: z.string({ required_error: 'Config key is required' }).min(1, 'Config key cannot be empty'),
  value: z.any().optional(),
  category: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  heroTitle: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

const updateConfigSchema = configSchema.partial();

const normalizeConfigPayload = (payload) => {
  const data = { ...payload };
  if (data.value === undefined) {
    const { key, description, ...rest } = data;
    data.value = rest;
  }
  return data;
};

// @desc    Get all configurations (with optional pagination)
// @route   GET /api/config
// @access  Private
export const getConfigs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    const total = await Config.countDocuments();
    const configs = await Config.find()
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: configs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: configs,
      message: 'Configurations retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single configuration by key or ID
// @route   GET /api/config/:key
// @access  Private
export const getConfig = async (req, res, next) => {
  try {
    const { key } = req.params;
    let config = null;

    if (mongoose.Types.ObjectId.isValid(key)) {
      config = await Config.findById(key);
    }

    if (!config) {
      config = await Config.findOne({ key });
    }

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, data: config, message: 'Configuration retrieved successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new configuration
// @route   POST /api/config
// @access  Private/Admin
export const createConfig = async (req, res, next) => {
  try {
    const validationResult = configSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map(err => err.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const data = normalizeConfigPayload(validationResult.data);
    const { key } = data;

    // Check if key already exists
    const exists = await Config.findOne({ key });
    if (exists) {
      return res.status(400).json({ success: false, message: `Configuration key '${key}' already exists.` });
    }

    const config = await Config.create(data);
    res.status(201).json({ success: true, data: config, message: 'Configuration created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update configuration by key or ID
// @route   PUT /api/config/:key
// @access  Private/Admin
export const updateConfig = async (req, res, next) => {
  try {
    const { key } = req.params;
    const validationResult = updateConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map(err => err.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const data = normalizeConfigPayload(validationResult.data);

    let config = null;

    if (mongoose.Types.ObjectId.isValid(key)) {
      config = await Config.findByIdAndUpdate(key, data, {
        new: true,
        runValidators: true,
      });
    }

    if (!config) {
      config = await Config.findOneAndUpdate({ key }, data, {
        new: true,
        runValidators: true,
      });
    }

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, data: config, message: 'Configuration updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete configuration by key or ID
// @route   DELETE /api/config/:key
// @access  Private/Admin
export const deleteConfig = async (req, res, next) => {
  try {
    const { key } = req.params;
    let config = null;

    if (mongoose.Types.ObjectId.isValid(key)) {
      config = await Config.findByIdAndDelete(key);
    }

    if (!config) {
      config = await Config.findOneAndDelete({ key });
    }

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Configuration deleted successfully' });
  } catch (error) {
    next(error);
  }
};
