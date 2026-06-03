import mongoose from 'mongoose';

const configSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Please add a config key'],
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    category: {
      type: String,
      trim: true,
    },
    resumeUrl: String,
    avatarUrl: String,
    heroTitle: String,
    githubUrl: String,
    linkedinUrl: String,
    twitterUrl: String,
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'config', // Forces using the exact collection name
  }
);

export default mongoose.model('Config', configSchema);
