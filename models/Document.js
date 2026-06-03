import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Please add a file URL'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Documents',
    },
    documentType: {
      type: String,
      default: 'PDF',
    },
    fileSize: {
      type: String,
      default: 'N/A',
    },
    author: {
      type: String,
      default: 'Masud Rana',
    },
    description: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    googleDocsLink: {
      type: String,
      trim: true,
    },
    previewImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Document', documentSchema);
