import mongoose from 'mongoose';
import { z } from 'zod';
import Document from '../models/Document.js';

// Zod schemas for validation
const documentSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
  url: z.string({ required_error: 'File URL is required' }).url('Please provide a valid file URL'),
  category: z.string().optional(),
  documentType: z.string().optional(),
  fileSize: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  googleDocsLink: z.string().url().optional().or(z.literal('')),
  previewImage: z.string().url().optional().or(z.literal('')),
});

const updateDocumentSchema = documentSchema.partial();

const normalizeDocumentPayload = (payload) => ({
  ...payload,
  tags: Array.isArray(payload.tags)
    ? payload.tags
    : String(payload.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
  googleDocsLink: payload.googleDocsLink || payload.url,
});

// @desc    Get all documents (with optional pagination)
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Document.countDocuments();
    const docs = await Document.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: docs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: docs,
      message: 'Documents retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, data: doc, message: 'Document retrieved successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new document
// @route   POST /api/documents
// @access  Private/Admin
export const createDocument = async (req, res, next) => {
  try {
    const validationResult = documentSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map(err => err.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const doc = await Document.create(normalizeDocumentPayload(validationResult.data));
    res.status(201).json({ success: true, data: doc, message: 'Document created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private/Admin
export const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const validationResult = updateDocumentSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map(err => err.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const doc = await Document.findByIdAndUpdate(id, normalizeDocumentPayload(validationResult.data), {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, data: doc, message: 'Document updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const doc = await Document.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
