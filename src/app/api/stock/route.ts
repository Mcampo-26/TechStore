import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Stock from '@/models/Stock';
import Product from '@/models/Product'; 

export async function GET() {
  try {
    await connectDB();
    const stocks = await Stock.find({}).populate({ path: 'producto', model: Product });
    return NextResponse.json(stocks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}