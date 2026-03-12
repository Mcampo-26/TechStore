import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },    // Foto 1
  image2: { type: String },                   // <-- AGREGAR ESTO
  image3: { type: String },                   // <-- AGREGAR ESTO
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);
export default Product;