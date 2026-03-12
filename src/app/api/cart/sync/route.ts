import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
      await dbConnect();
      const { userId, cart } = await req.json();
  
      console.log(">>>> RECIBIENDO SYNC DE CARRITO");
      console.log("USER ID:", userId);
      console.log("ITEMS A GUARDAR:", cart?.length || 0);
  
      if (!userId) {
          console.log("ERROR: No se recibió userId en el Sync");
          return NextResponse.json({ message: "No user ID" }, { status: 400 });
      }
  
      // Actualizamos usando returnDocument para evitar el warning
      const updatedUser = await User.findByIdAndUpdate(
          userId, 
          { $set: { cart: cart } }, 
          { returnDocument: 'after' } // <--- CAMBIO: Reemplazamos { new: true }
      );
  
      console.log("CONFIRMACIÓN DB: Carrito guardado con", updatedUser?.cart?.length, "productos.");
      console.log("-----------------------------------------");
  
      return NextResponse.json({ message: "Guardado OK" });
    } catch (error) {
      console.error("SYNC_ERROR:", error);
      return NextResponse.json({ message: "Error en Sync" }, { status: 500 });
    }
  }