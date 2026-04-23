import mongoose, { Schema, model, models } from 'mongoose';

/**
 * Interface para TypeScript (Opcional pero recomendada)
 */
export interface ILog {
  tipo: 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'STOCK_IN' | 'STOCK_OUT' | 'PRODUCT_CREATE' | 'SYSTEM_ERROR' | 'USER_UPDATE';
  nivel: 'info' | 'warning' | 'critical';
  usuarioId?: string;
  usuarioNombre?: string;
  detalles: string;
  metadata?: {
    productoId?: string;
    cantidad?: number;
    ip?: string;
    userAgent?: string;
    errorStack?: string;
    [key: string]: any; // Permite cualquier otra info extra
  };
  createdAt: Date;
}

const LogSchema = new Schema<ILog>({
  // Categoría del evento
  tipo: { 
    type: String, 
    required: true,
    index: true // Indexado para búsquedas rápidas
  },
  
  // Nivel de importancia (para filtros visuales: azul, amarillo, rojo)
  nivel: { 
    type: String, 
    enum: ['info', 'warning', 'critical'], 
    default: 'info' 
  },

  // Quién realizó la acción
  usuarioId: { type: String, index: true },
  usuarioNombre: { type: String },

  // Descripción legible para humanos
  detalles: { type: String, required: true },

  // Objeto flexible para datos técnicos (IDs de productos, cambios, etc.)
  metadata: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },

  // Marca de tiempo
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

/**
 * El modelo se exporta asegurando que no se compile dos veces en Next.js
 */
const Log = models.Log || model<ILog>('Log', LogSchema);

export default Log;