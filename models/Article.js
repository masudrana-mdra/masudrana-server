import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an article title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an article description'],
    },
    externalLink: {
      type: String,
      required: [true, 'Please add the external publication link'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail image URL'],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;
