import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a blog description'],
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    readingTime: {
      type: String,
      default: '3 min read',
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      required: [true, 'Please add a featured image URL'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
