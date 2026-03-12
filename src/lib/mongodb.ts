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
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Conectado a MongoDB");
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