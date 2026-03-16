import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, cart } = await req.json();

    // 1. Validación de seguridad básica
    if (!userId) {
      return NextResponse.json({ message: "UserId es requerido" }, { status: 400 });
    }

    // 2. Limpieza de datos antes de guardar
    // Nos aseguramos de que el carrito sea un array y no algo nulo
    const cartToSave = Array.isArray(cart) ? cart : [];

    console.log(`>>>> SYNC DB [User: ${userId}]: Guardando ${cartToSave.length} items.`);

    // 3. Actualización atómica
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          cart: cartToSave,
          lastCartUpdate: new Date() // Tip: Útil para saber cuándo fue el último cambio
        } 
      },
      { 
        returnDocument: 'after', 
        runValidators: true // Obliga a que el esquema del modelo se respete
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Carrito sincronizado", 
      count: updatedUser.cart?.length || 0 
    });

  } catch (error: any) {
    console.error("CRITICAL_SYNC_ERROR:", error.message);
    return NextResponse.json(
      { message: "Error interno en la sincronización del carrito" }, 
      { status: 500 }
    );
  }
}