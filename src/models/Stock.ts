import mongoose, { Schema, model, models, Document } from 'mongoose';

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
  costoPromedio: number; // Nuevo: Para mostrar en la interfaz de detalles
  lotes: ILote[];
  stockMinimo: number;
  createdAt: Date;
  updatedAt: Date;
}

const LoteSchema = new Schema<ILote>({
  codigo: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 0 },
  cantidadInicial: { type: Number, required: true },
  costoUnitario: { type: Number, required: true },
  fechaVencimiento: { type: Date },
  ubicacion: { type: String, default: "Deposito Central" }
}, { timestamps: true });

const StockSchema = new Schema<IStock>({
  producto: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', // Referencia vital para el .populate()
    required: true, 
    unique: true 
  },
  totalQuantity: { type: Number, default: 0 },
  costoPromedio: { type: Number, default: 0 }, // Calculado automáticamente
  lotes: [LoteSchema],
  stockMinimo: { type: Number, default: 5 },
}, { timestamps: true });

// MIDDLEWARE: Recalcula totales y costos antes de guardar
StockSchema.pre('save', async function(next) {
  if (this.lotes && this.lotes.length > 0) {
    // 1. Calcular Cantidad Total
    this.totalQuantity = this.lotes.reduce((acc, lote) => acc + lote.cantidad, 0);

    // 2. Calcular Costo Promedio Ponderado (CPP)
    // Útil para saber cuánto vale tu inventario actual
    const inversionTotal = this.lotes.reduce((acc, lote) => {
      return acc + (lote.cantidad * lote.costoUnitario);
    }, 0);

    this.costoPromedio = this.totalQuantity > 0 
      ? inversionTotal / this.totalQuantity 
      : 0;
  } else {
    this.totalQuantity = 0;
    this.costoPromedio = 0;
  }

});

const Stock = models.Stock || model<IStock>('Stock', StockSchema);
export default Stock;