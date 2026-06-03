import mongoose from 'mongoose';
import { z } from 'zod';
import Message from '../models/Message.js';

// Zod schema for message validation
const messageSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty').trim(),
  email: z.string({ required_error: 'Email is required' }).email('Please provide a valid email address').trim().toLowerCase(),
  subject: z.string({ invalid_type_error: 'Subject must be a string' }).optional().default('No Subject'),
  message: z.string({ required_error: 'Message is required' }).min(1, 'Message cannot be empty').trim(),
});

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res, next) => {
  try {
    const validationResult = messageSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const newMessage = await Message.create(validationResult.data);
    res.status(201).json({ success: true, data: newMessage, message: 'Message sent successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message read status
// @route   PUT /api/messages/:id
// @access  Private/Admin
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isRead = req.body.isRead !== undefined ? req.body.isRead : !message.isRead;
    // Set field 'read' as fallback if standard uses isRead or vice-versa
    message.read = message.isRead;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private/Admin
export const getMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};
