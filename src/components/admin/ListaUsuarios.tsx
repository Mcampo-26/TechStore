"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User as UserIcon,
    Search,
    UserPlus,
    Trash2,
    Edit3,
    Shield,
    Mail,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { useUsuariosStore } from "@/store/useUsuariosStore";
import { EditUserModal } from "./EditUserModal";
import Swal from "sweetalert2";

// Definimos la interfaz para evitar errores de tipado
interface User {
    _id: string;
    nombre: string;
    email: string;
    role?: {
        _id: string;
        name: string;
        permisos?: Record<string, boolean>;
    };
    createdAt?: string;
}

export const ListaUsuarios = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    // CORRECCIÓN DEL ERROR: Tipamos el estado como User o null
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const {
        fetchUsuarios,
        usuarios,
        eliminarUsuario,
        totalPages,
        currentPage,
        loading
    } = useUsuariosStore();

    useEffect(() => {
        fetchUsuarios(currentPage);
    }, [currentPage, fetchUsuarios]);

    const handleDelete = async (id: string, nombre: string) => {
        const result = await Swal.fire({
            title: `<span class="text-xs font-black uppercase tracking-widest text-slate-900">¿ELIMINAR A ${nombre.toUpperCase()}?</span>`,
            text: "Esta acción revocará todos los accesos del usuario.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "SÍ, ELIMINAR",
            cancelButtonText: "CANCELAR",
            background: 'var(--background)',
            color: 'var(--foreground)'
        });

        if (result.isConfirmed) {
            try {
                await eliminarUsuario(id);
                Swal.fire({
                    title: "LOGRADO",
                    text: "El usuario ha sido removido.",
                    icon: "success",
                    confirmButtonColor: "#2563eb"
                });
            } catch (e) {
                Swal.fire("ERROR", "No se pudo procesar la solicitud.", "error");
            }
        }
    };

    const filteredUsers = usuarios.filter((u) =>
        `${u.nombre} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--foreground)' }}>
                        Gestión de <span className="text-blue-600">Usuarios</span>
                    </h1>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
                        Administración de cuentas y seguridad
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" style={{ color: 'var(--foreground)' }} />
                        <input
                            type="text"
                            placeholder="BUSCAR POR NOMBRE O EMAIL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-2 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600 transition-all"
                            style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                        <UserPlus size={16} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* CUERPO / GRID */}
            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Sincronizando base de datos...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredUsers.map((u) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={u._id}
                                className="rounded-[2.5rem] border p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                                        <UserIcon size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(u as User); // El 'as User' fuerza la compatibilidad final
                                                setShowModal(true);
                                            }}
                                            className="p-3 rounded-xl border hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-40 hover:opacity-100 active:scale-90"
                                            style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id, u.nombre ?? "Usuario")}
                                            className="p-3 rounded-xl border hover:bg-red-600 hover:text-white transition-all opacity-40 hover:opacity-100"
                                            style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--foreground)' }}>
                                    {u.nombre}
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 opacity-60 text-[10px] font-bold uppercase" style={{ color: 'var(--foreground)' }}>
                                        <Mail size={12} className="text-blue-600" /> {u.email}
                                    </div>
                                    <div className="flex items-center gap-2">
  <Shield size={12} className="text-blue-600" />
  <span className="font-bold text-[10px] uppercase">
    {(() => {
      // 1. Si es un objeto y tiene la propiedad name (Populate exitoso)
      if (u.role && typeof u.role === 'object' && 'name' in u.role) {
        return <span>{u.role.name}</span>;
      }
      
      // 2. Si es un string (Dato corrupto o ID sin poblar)
      if (typeof u.role === 'string') {
        return (
          <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
            Error: {u.role}
          </span>
        );
      }

      // 3. Caso por defecto
      return <span className="opacity-40">Sin Rol</span>;
    })()}
  </span>
</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* PAGINACIÓN */}
            {!loading && totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => fetchUsuarios(currentPage - 1)}
                        className="p-4 rounded-2xl border disabled:opacity-5 transition-all hover:bg-blue-600 hover:text-white"
                        style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: 'var(--foreground)' }}>
                        {currentPage} <span className="opacity-20">/</span> {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchUsuarios(currentPage + 1)}
                        className="p-4 rounded-2xl border disabled:opacity-5 transition-all hover:bg-blue-600 hover:text-white"
                        style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* MODAL DE EDICIÓN */}
            {showModal && selectedUser && (
                <EditUserModal
                    isOpen={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />
            )}
        </div>
    );
};