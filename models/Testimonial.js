import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Please add client name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please add client professional role'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add rating'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
      default: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Please add testimonial text'],
    },
    clientImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
