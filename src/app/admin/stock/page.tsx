import StockClient from "../stock/StockClient";
// Importamos el modelo de Stock para la consulta directa
import connectDB from "@/lib/mongodb";
import Stock from "@/models/Stock";
import Product from "@/models/Product"; 

export default async function StockPage() {
  await connectDB();

  // Traemos los Stocks populados directamente desde el servidor
  // Esto garantiza que 'item.lotes' y 'item.producto' lleguen al cliente
  const stockData = await Stock.find({})
    .populate({ path: 'producto', model: Product })
    .lean();

  // Convertimos los ObjectIds a strings para evitar errores de serialización en Next.js
  const serializedStock = JSON.parse(JSON.stringify(stockData));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto">
        {/* Ahora pasamos la data de STOCK, que ya incluye al producto dentro */}
        <StockClient products={serializedStock} />
      </div>
    </div>
  );
}