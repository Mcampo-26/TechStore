import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, definí la variable MONGODB_URI en el archivo .env.local'
  );
}

/** * Global se usa para mantener la conexión activa entre recargas de código en desarrollo.
 * Esto evita que las conexiones crezcan exponencialmente.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Si ya hay una conexión, la usamos
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay conexión, creamos una nueva promesa de conexión
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // CONFIGURACIÓN DE ALTO RENDIMIENTO:
      maxPoolSize: 10,       // Máximo de conexiones permitidas
      minPoolSize: 5,        // MANTIENE 5 CONEXIONES SIEMPRE ABIERTAS (Evita el lag inicial)
      connectTimeoutMS: 10000, // Tiempo máximo para conectar
      socketTimeoutMS: 45000,  // Cierra sockets inactivos después de 45s
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("🚀 MongoDB: Conexión caliente y lista");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;