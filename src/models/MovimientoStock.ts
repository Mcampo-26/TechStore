import mongoose, { Schema, model, models } from 'mongoose';

const MovimientoStockSchema = new Schema({
  producto: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  tipo: { 
    type: String, 
    enum: ['entrada', 'salida', 'ajuste', 'devolucion'], 
    required: true 
  },
  cantidad: { type: Number, required: true }, // Positivo para entrada, negativo para salida
  loteCodigo: { type: String }, // A qué lote afectó este movimiento
  referenciaTipo: { 
    type: String, 
    enum: ['venta', 'compra', 'ajuste_manual', 'devolucion_cliente'],
    required: true 
  },
  referenciaId: { type: Schema.Types.ObjectId }, // ID de la Venta o Compra asociada
  usuario: { type: String, required: true }, // Quién lo hizo (ej: "Admin Mauricio")
  notas: { type: String },
  saldoResultante: { type: Number, required: true } // Stock total después del movimiento
}, { 
  timestamps: true 
});

const MovimientoStock = models.MovimientoStock || model('MovimientoStock', MovimientoStockSchema);
export default MovimientoStock;