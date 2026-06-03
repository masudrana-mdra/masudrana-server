import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an activity title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an activity description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Event',
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
