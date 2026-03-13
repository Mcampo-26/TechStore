import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true 
  }
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);