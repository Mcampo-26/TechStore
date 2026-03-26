import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Definí MONGODB_URI en .env.local');
}

// Tipado para el objeto global
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached?.conn) return cached.conn;

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Mantiene hasta 10 conexiones listas para reutilizar
      serverSelectionTimeoutMS: 5000, // No espera más de 5s si la DB está caída
      socketTimeoutMS: 45000, // Cierra sockets inactivos
      family: 4 // Usa IPv4 (a veces acelera la conexión en ciertos hostings)
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("🚀 MongoDB: Nueva conexión establecida");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; // Limpiar promesa fallida para reintentar
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;