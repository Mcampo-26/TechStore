import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Stock from '@/models/Stock';

export async function GET() {
  await connectDB();
  const productos = await Product.find({});
  let creados = 0;

  for (const prod of productos) {
    const existe = await Stock.findOne({ producto: prod._id });
    if (!existe) {
      await Stock.create({
        producto: prod._id,
        totalQuantity: prod.stock || 0,
        lotes: [{
          codigo: 'INICIAL',
          cantidad: prod.stock || 0,
          cantidadInicial: prod.stock || 0,
          costoUnitario: 0,
          ubicacion: 'Deposito Central'
        }]
      });
      creados++;
    }
  }
  return NextResponse.json({ message: `Sincronización lista. Se crearon ${creados} registros de stock.` });
}