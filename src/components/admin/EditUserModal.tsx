"use client";

import React, { useState, useEffect } from "react";
import { X, Save, ShieldCheck, User as UserIcon, ChevronDown } from "lucide-react";
import { useUsuariosStore } from "@/store/useUsuariosStore";
import { useRoleStore } from "@/store/useRolesStore"; // Sincronizado con tu CRUD de roles
import Swal from "sweetalert2";

export const EditUserModal = ({ isOpen, handleClose, user }: any) => {
  const { actualizarUsuario } = useUsuariosStore();
  const { roles, fetchRoles } = useRoleStore(); // Usamos fetchRoles del CRUD de roles

  const [formData, setFormData] = useState({
    nombre: "",
    role: ""
  });

  // Cargamos roles y datos del usuario
  useEffect(() => {
    if (isOpen && roles.length === 0) {
      fetchRoles();
    }
    if (user) {
      // Buscamos si el rol actual del usuario coincide con algún objeto en nuestra lista de roles
      const currentRole = roles.find(r => r.name.toLowerCase() === "user" || r._id === user.role?._id || r._id === user.role);
      
      setFormData({
        nombre: user.name || user.nombre || "",
        // Si encontramos el rol en la lista de la DB, usamos su _id. 
        // Si no, lo dejamos vacío para obligar al usuario a elegir uno válido.
        role: currentRole?._id || (typeof user.role === 'string' && user.role.length === 24 ? user.role : "")
      });
    }
  }, [user, isOpen, roles, fetchRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación local antes de enviar
    if (!formData.nombre.trim() || !formData.role) {
      Swal.fire({
        title: "DATOS REQUERIDOS",
        text: "El nombre y el rol son obligatorios para continuar.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
        background: 'var(--card-bg)',
        color: 'var(--foreground)'
      });
      return;
    }
  
    try {
      // MAPEAREMOS LOS DATOS PARA QUE COINCIDAN CON TU MODELO DE MONGOOSE
      const dataToUpdate = {
        name: formData.nombre, // Cambiamos a 'name' porque así está en tu base de datos
        role: formData.role    // Enviamos el _id del rol capturado por el select
      };
  
      // Llamada al store de Zustand
      await actualizarUsuario(user._id, dataToUpdate);
  
      // Notificación de éxito
      Swal.fire({
        title: "¡SINCRONIZADO!",
        text: `El perfil de ${formData.nombre.toUpperCase()} ha sido actualizado en la base de datos.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--card-bg)',
        color: 'var(--foreground)'
      });
  
      handleClose();
      
    } catch (error: any) {
      console.error("Error en el submit del modal:", error);
      Swal.fire({
        title: "ERROR DE SINCRONIZACIÓN",
        text: "El servidor rechazó la actualización. Verifica la conexión.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: 'var(--card-bg)',
        color: 'var(--foreground)'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg rounded-[2.5rem] p-10 border shadow-2xl animate-in zoom-in duration-300 relative"
        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-theme)' }}
      >
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <ShieldCheck size={120} style={{ color: 'var(--foreground)' }} />
        </div>

        <div className="flex justify-between items-center mb-10 relative">
          <div className="flex items-center gap-4">
             <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/40">
                <UserIcon size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--foreground)' }}>
                  Editar Usuario
                </h2>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Configuración de Acceso</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-red-500/10 rounded-full transition-all group">
            <X size={24} className="opacity-40 group-hover:opacity-100 group-hover:text-red-500 transition-all" style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombre */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-2" style={{ color: 'var(--foreground)' }}>
              Identidad del Usuario
            </label>
            <input 
              className="w-full bg-[var(--card-bg)] border-2 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-blue-600 transition-all uppercase tracking-wide"
              style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Nombre del operador..."
            />
          </div>

          {/* Rol - Selector Estilizado */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-2" style={{ color: 'var(--foreground)' }}>
              Nivel de Privilegios
            </label>
            <div className="relative">
            <select 
  value={formData.role} // Esto debe ser un ID (ej: 65f...)
  onChange={(e) => setFormData({...formData, role: e.target.value})}
>
  <option value="" disabled>Seleccionar Rol...</option>
  {roles.map((r: any) => (
    <option key={r._id} value={r._id}> {/* IMPORTANTE: value debe ser r._id */}
      {r.name.toUpperCase()}
    </option>
  ))}
</select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" style={{ color: 'var(--foreground)' }} />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Save size={18} /> Sincronizar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};