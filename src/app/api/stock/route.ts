import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock';
import Product from '@/models/Product'; 

export async function GET() {
  try {
    await connectDB();
    
    // Traemos todo y populamos
    const stocks = await Stock.find({})
      .populate({ path: 'producto', model: Product })
      .lean(); // .lean() hace que la consulta sea más rápida y devuelva objetos planos

    // Filtramos los que por algún motivo no tengan el producto vinculado
    const validStocks = stocks.filter(s => s.producto !== null);

    return NextResponse.json(validStocks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}