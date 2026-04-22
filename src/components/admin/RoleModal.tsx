"use client";
import React, { useEffect, useState } from "react";
import { X, Shield, Save, Check, LayoutDashboard, Users, Key, Box, UploadCloud, History } from "lucide-react";
import Swal from "sweetalert2";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: any) => void;
  initialData?: any;
}

export default function RoleModal({ isOpen, onClose, onSave, initialData }: RoleModalProps) {
  const [name, setName] = useState('');
  
  // Estado inicial limpio (Ideal para el rol 'Comprador')
  const defaultPermissions = {
    viewDash: false,
    viewUsuarios: false,
    viewRoles: false,
    viewStock: false,
    viewCarga: false,
    viewAuditoria: false,
  };

  const [permisos, setPermisos] = useState<Record<string, boolean>>(defaultPermissions);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      // Nos aseguramos de mezclar con los default por si faltan llaves en la DB
      setPermisos({ ...defaultPermissions, ...(initialData.permissions || initialData.permisos) });
    } else {
      setName('');
      setPermisos(defaultPermissions);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: string) => {
    setPermisos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({ icon: 'error', title: 'Falta el nombre', text: 'Debes asignar un nombre al rol.' });
      return;
    }

    // ENVIAMOS CON LA LLAVE 'permissions' (en inglés) para que Mongoose lo lea bien
    onSave({ 
      name, 
      permissions: permisos 
    });
    onClose();
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'viewDash': return <LayoutDashboard size={18} />;
      case 'viewUsuarios': return <Users size={18} />;
      case 'viewRoles': return <Key size={18} />;
      case 'viewStock': return <Box size={18} />;
      case 'viewCarga': return <UploadCloud size={18} />;
      case 'viewAuditoria': return <History size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[2.5rem] shadow-2xl border border-[var(--border-theme)] bg-[var(--background)]">
        
        {/* HEADER */}
        <div className="p-8 border-b border-[var(--border-theme)] flex justify-between items-center bg-[var(--nav-bg)]">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--foreground)]">
                {initialData ? "Editar Privilegios" : "Configurar Rol"}
              </h2>
              <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest">Seguridad y Accesos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-[var(--foreground)] opacity-50">
            <X size={28} />
          </button>
        </div>

        {/* CUERPO */}
        <form className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div>
            <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-50 text-[var(--foreground)]">Nombre del Rol (Ej: Comprador)</label>
            <input 
              type="text" 
              className="w-full bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-theme)] rounded-2xl px-5 py-3.5 font-bold outline-none focus:border-blue-500 transition-all" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Escribe el nombre del rol..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 text-[var(--foreground)]">
                Accesos al Panel Admin
                </label>
                {Object.values(permisos).every(v => !v) && (
                    <span className="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg font-black uppercase">Modo Solo Marketplace</span>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(permisos).map((key) => (
                <div 
                  key={key}
                  onClick={() => handleToggle(key)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    permisos[key] 
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20' 
                    : 'bg-[var(--card-bg)] border-[var(--border-theme)] hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-colors ${permisos[key] ? 'text-white' : 'text-blue-500'}`}>
                      {getIcon(key)}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                      permisos[key] ? 'text-white' : 'text-[var(--foreground)]'
                    }`}>
                      {key.replace('view', '').toUpperCase()}
                    </span>
                  </div>

                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    permisos[key] ? 'bg-white text-blue-600' : 'bg-[var(--border-theme)] text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-8 border-t border-[var(--border-theme)] flex gap-4 bg-[var(--nav-bg)]">
          <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-[var(--border-theme)] text-[var(--foreground)] opacity-50 hover:opacity-100 transition-all">
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={18} />
            {initialData ? "Actualizar Rol" : "Crear Rol"}
          </button>
        </div>
      </div>
    </div>
  );
}