"use client";

import React, { useState, ChangeEvent } from "react";
import { Mail, Send, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export const ContactSection = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // LLAMADA REAL A TU API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setIsSent(true);
        setForm({ name: "", email: "", message: "" });
        // Volver al estado normal después de 4 segundos
        setTimeout(() => setIsSent(false), 4000);
      } else {
        const data = await response.json();
        alert(data.error || "Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-[#f8fafc] px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LADO IZQUIERDO: TEXTO */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <MessageSquare size={12} />
              Contacto Directo
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              ¿TIENES UNA <span className="text-blue-600">CONSULTA?</span> 
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              Estamos listos para ayudarte con el mejor equipamiento tech. Escríbenos y nuestro equipo te responderá en tiempo récord.
            </p>
            
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-blue-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-slate-900 font-bold">soporte@techstore.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre Completo</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mensaje</label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || isSent}
                className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 mt-4
                  ${isSent ? "bg-green-500 text-white shadow-lg shadow-green-200" : 
                    isSending ? "bg-slate-800 text-white" : 
                    "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"}`}
              >
                {isSent ? (
                  <><CheckCircle2 size={18} /> ¡Mensaje Enviado!</>
                ) : isSending ? (
                  <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                ) : (
                  <><Send size={18} /> Enviar Consulta</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};