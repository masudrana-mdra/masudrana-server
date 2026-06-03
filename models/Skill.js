import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Deployment'],
    },
    percentage: {
      type: Number,
      required: [true, 'Please add a percentage rating'],
      min: [1, 'Percentage must be at least 1'],
      max: [100, 'Percentage cannot exceed 100'],
    },
    icon: {
      type: String,
      default: 'Code', // Represents Lucide icon name
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
