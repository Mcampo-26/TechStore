"use client";

import React, { useState, ChangeEvent } from "react";
import { Mail, Send, CheckCircle2, Loader2, MessageSquare, ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "@/store/useProductStore";

export const ContactSection = () => {
  const router = useRouter();
  const setLoading = useProductStore((state) => state.setLoading);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setLoading(true);
    router.back();
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
    <section id="contacto" className="py-24 px-6 transition-colors duration-300 relative" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* BOTONES DE NAVEGACIÓN ESTILO CATÁLOGO */}
      <div className="max-w-5xl mx-auto mb-8 h-10">
        <div className="flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400"
          >
            <div className="p-2 rounded-full border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-600/10">
              <ChevronLeft size={14} />
            </div>
            <span>Regresar</span>
          </motion.button>

          <Link href="/" onClick={() => setLoading(true)}>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all text-[var(--foreground)]"
            >
              <span>Inicio</span>
              <div className="p-2 rounded-full border border-[var(--border-theme)] group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                <Home size={14} />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LADO IZQUIERDO: TEXTO */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <MessageSquare size={12} />
              Contacto Directo
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              ¿TIENES UNA <span className="text-blue-600">CONSULTA?</span> 
            </h2>
            <p className="opacity-70 text-lg font-medium leading-relaxed max-w-md">
              Estamos listos para ayudarte con el mejor equipamiento tech. Escríbenos y nuestro equipo te responderá en tiempo récord.
            </p>
            
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
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