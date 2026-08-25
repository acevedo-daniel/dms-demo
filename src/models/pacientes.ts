import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v: string) {
        // Solo validar unicidad si el email no está vacío
        return !v || v.trim() !== '';
      },
      message: 'Email no puede estar vacío'
    }
  },
  birthDate: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  obraSocial: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Evitar el error de "Cannot overwrite model once compiled"
const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;