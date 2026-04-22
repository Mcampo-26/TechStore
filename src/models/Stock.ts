import mongoose, { Schema, model, models, Document } from 'mongoose';

// 1. Interfaces para TypeScript
interface ILote {
  codigo: string;
  cantidad: number;
  cantidadInicial: number;
  costoUnitario: number;
  fechaVencimiento?: Date;
  ubicacion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStock extends Document {
  producto: mongoose.Types.ObjectId;
  totalQuantity: number;
  lotes: ILote[];
  stockMinimo: number;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Esquema de Lotes (Sub-documento)
const LoteSchema = new Schema<ILote>({
  codigo: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 0 },
  cantidadInicial: { type: Number, required: true },
  costoUnitario: { type: Number, required: true },
  fechaVencimiento: { type: Date },
  ubicacion: { type: String, default: "Deposito Central" }
}, { timestamps: true });

// 3. Esquema de Stock Principal
const StockSchema = new Schema<IStock>({
  producto: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    unique: true 
  },
  totalQuantity: { 
    type: Number, 
    default: 0 
  },
  lotes: [LoteSchema],
  stockMinimo: { 
    type: Number, 
    default: 5 
  },
}, { 
  timestamps: true 
});

// 4. Middleware para calcular el total antes de guardar
// Usamos una función async estándar para evitar el error ts(2349) con 'next'
StockSchema.pre('save', async function() {
  if (this.lotes) {
    this.totalQuantity = this.lotes.reduce((acc, lote) => acc + lote.cantidad, 0);
  }
});

// 5. Exportación del Modelo
const Stock = models.Stock || model<IStock>('Stock', StockSchema);

export default Stock;