import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validaciones
    if (!name || name.length < 2) return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    if (!email.includes("@")) return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    if (!message || message.length < 10) return NextResponse.json({ error: "Mensaje muy corto" }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"TechStore Contact" <${process.env.EMAIL_USER}>`,
      to: "mcampo26@gmail.com", 
      subject: `🚀 Nuevo contacto: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Nuevo mensaje desde TechStore</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 10px;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: "Fallo en el servidor", details: error.message }, { status: 500 });
  }
}