import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, cart } = await req.json();

    console.log(">>>> SYNC CARRITO:", userId, "| Items:", cart?.length || 0);

    if (!userId) {
      return NextResponse.json({ message: "No user ID" }, { status: 400 });
    }

    // Usamos returnDocument: 'after' para cumplir con las mejores prácticas de 2026
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { cart: cart } },
      { returnDocument: 'after', upsert: false }
    );

    return NextResponse.json({ 
      message: "Guardado OK", 
      count: updatedUser?.cart?.length || 0 
    });
  } catch (error) {
    console.error("SYNC_ERROR:", error);
    return NextResponse.json({ message: "Error en Sync" }, { status: 500 });
  }
}