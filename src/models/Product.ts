import mongoose, { Schema, model, models } from 'mongoose';

// Mantenemos la limpieza de modelo para evitar errores en Hot Reload de Next.js
if (models.Product) {
  delete models.Product;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Este es el precio de VENTA
  image: { type: String, required: true },
  image2: { type: String },
  image3: { type: String },
  category: { type: String, required: true },
  
  /* CORRECCIÓN: 
     Mantenemos el campo 'stock' por compatibilidad con tus vistas actuales,
     pero ahora lo trataremos como un "espejo" del totalQuantity 
     que calculamos en la colección Stock.
  */
  stock: { type: Number, default: 0 },
  
  // Mantenemos tus campos de oferta intactos
  isOferta: { type: Boolean, default: false },
  descuento: { type: Number, default: 0 }, 
}, { 
  timestamps: true 
});

const Product = model('Product', ProductSchema);
export default Product;