import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an image title'],
      trim: true,
      default: 'Untitled image',
    },
    url: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    category: {
      type: String,
      default: 'Gallery',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    cameraInfo: {
      type: String,
      default: '',
    },
    resolution: {
      type: String,
      default: '',
    },
    customLabels: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

imageSchema.virtual('imageUrl').get(function () {
  return this.url;
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
