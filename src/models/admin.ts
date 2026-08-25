import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Evitar el error de "Cannot overwrite model once compiled"
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;

