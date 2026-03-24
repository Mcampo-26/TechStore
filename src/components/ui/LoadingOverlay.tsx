"use client";
import { Loader2 } from "lucide-react";

export const LoadingOverlay = ({ message = "Cargando..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold tracking-tight text-sm uppercase">{message}</p>
      </div>
    </div>
  );
};