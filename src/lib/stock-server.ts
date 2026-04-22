import connectDB from '@/lib/mongodb';
import  Stock from '../models/Stock';
import Product from '@/models/Product';

export async function getFullInventory() {
  await connectDB();
  return await Stock.find({})
    .populate({
      path: 'producto',
      model: Product,
      select: 'name images category'
    })
    .lean();
}