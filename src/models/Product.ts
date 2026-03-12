import mongoose, { Schema, model, models } from 'mongoose';

// Limpieza de modelo para evitar errores de compilación en desarrollo
if (models.Product) {
  delete models.Product;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  image2: { type: String },
  image3: { type: String },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  
  // Nombres ajustados para coincidir exactamente con el Front
  isOferta: { type: Boolean, default: false },
  descuento: { type: Number, default: 0 }, 
}, { 
  timestamps: true 
});

const Product = model('Product', ProductSchema);
export default Product;