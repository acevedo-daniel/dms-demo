import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Orthodontics', 'Surgery', 'Aesthetic', 'Pediatric'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Evitar el error de "Cannot overwrite model once compiled"
const Treatment = mongoose.models.Treatment || mongoose.model('Treatment', treatmentSchema);

export default Treatment;