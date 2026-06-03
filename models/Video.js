import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Please specify the video platform'],
      enum: ['YouTube', 'GoogleDrive', 'Vimeo'],
      default: 'YouTube',
    },
    description: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

videoSchema.virtual('videoUrl').get(function () {
  return this.url;
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
