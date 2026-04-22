import mongoose, { Schema, model, models } from 'mongoose';
import './Role';

const UserSchema = new Schema({
  // AGREGAMOS 'name' porque así está en tu base de datos física
  name: { type: String }, 
  // Mantenemos 'nombre' por compatibilidad con tu código actual
  nombre: { type: String },
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  
  role: { 
    type: Schema.Types.Mixed, 
    ref: 'Role', 
    required: true 
  },

  cart: [
    {
      id: String,
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 }
    }
  ]
}, { 
  timestamps: true,
  // Esto permite que si en la DB hay campos no definidos aquí, no los borre al guardar
  strict: false 
});

export default models.User || model('User', UserSchema);