import { NextResponse } from 'next/server';
import  connectDB  from '@/lib/mongodb'; // Tu función de conexión
import Log from '@/models/Log'; // Tu modelo de Log (mira el paso 2)

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { 
      tipo,          // 'AUTH_LOGIN', 'STOCK_UPDATE', 'PRODUCT_EDIT'
      usuarioId, 
      usuarioNombre, 
      detalles, 
      metadata       // Info extra (IP, navegador, ID del producto)
    } = body;

    const newLog = await Log.create({
      tipo,
      usuarioId,
      usuarioNombre,
      detalles,
      metadata,
      createdAt: new Date()
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar el log' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Traemos los últimos 200 eventos, del más reciente al más antiguo
    const logs = await Log.find().sort({ createdAt: -1 }).limit(200);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener logs' }, { status: 500 });
  }
}