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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setIsSent(true);
        setForm({ name: "", email: "", message: "" });
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
    /* CAMBIO 1: El fondo de la sección ahora usa var(--background) */
    <section id="contacto" className="py-24 px-6 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LADO IZQUIERDO: TEXTO */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <MessageSquare size={12} />
              Contacto Directo
            </div>
            {/* CAMBIO 2: Quitamos text-slate-900 para que use el foreground global */}
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              ¿TIENES UNA <span className="text-blue-600">CONSULTA?</span> 
            </h2>
            {/* CAMBIO 3: Opacidad para el texto secundario en lugar de un color fijo */}
            <p className="opacity-70 text-lg font-medium leading-relaxed max-w-md">
              Estamos listos para ayudarte con el mejor equipamiento tech. Escríbenos y nuestro equipo te responderá en tiempo récord.
            </p>
            
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                {/* CAMBIO 4: El icono usa var(--card-bg) */}
                <div 
                  className="w-12 h-12 shadow-sm rounded-2xl flex items-center justify-center text-blue-600 border"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Email</p>
                  <p className="font-bold">soporte@techstore.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          {/* CAMBIO 5: La caja del formulario usa var(--card-bg) */}
          <div 
            className="p-8 md:p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-300"
            style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-theme)' 
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black opacity-40 uppercase ml-2 tracking-widest">Nombre Completo</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  /* CAMBIO 6: Inputs con fondo adaptable */
                  className="w-full rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none border"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black opacity-40 uppercase ml-2 tracking-widest">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  className="w-full rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none border"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black opacity-40 uppercase ml-2 tracking-widest">Mensaje</label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none border"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSending || isSent}
                className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 mt-4
                  ${isSent ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : 
                    isSending ? "bg-slate-800 dark:bg-slate-700 text-white" : 
                    "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20"}`}
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