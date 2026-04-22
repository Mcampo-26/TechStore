import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Role from '@/models/Role';

export async function GET() {
  await dbConnect();
  try {
    const roles = await Role.find({}).sort({ createdAt: -1 });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener roles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    // Validamos que el nombre no esté vacío
    if (!body.name) {
      return NextResponse.json({ message: "El nombre es obligatorio" }, { status: 400 });
    }
    const newRole = await Role.create(body);
    return NextResponse.json(newRole);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error al crear rol" }, { status: 400 });
  }
}