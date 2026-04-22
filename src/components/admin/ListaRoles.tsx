"use client";
import { useEffect, useState } from 'react';
import { useRoleStore } from '@/store/useRolesStore';
import Swal from 'sweetalert2';
import { Plus, Trash2, ShieldCheck, Edit3, Search } from 'lucide-react';
import axios from 'axios';
import RoleModal from './RoleModal';

export default function ListaRoles() {
  const { roles, fetchRoles, deleteRole } = useRoleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openModal = (role: any = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedRole) {
        await axios.put(`/api/roles/${selectedRole._id}`, data);
      } else {
        await axios.post('/api/roles', data);
      }
      fetchRoles();
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: '¡Operación Exitosa!',
        showConfirmButton: false,
        timer: 1500,
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
      });
    } catch (error: any) {
      Swal.fire("Error", "No se pudo procesar la solicitud", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const isDark = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: `¿Eliminar ${name}?`,
      text: "Los usuarios con este rol perderán sus permisos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, borrar',
      background: isDark ? '#1e293b' : '#fff',
      color: isDark ? '#fff' : '#000',
    });

    if (result.isConfirmed) {
      await deleteRole(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Roles del Sistema
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Controla los niveles de acceso y seguridad de tu plataforma.
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
        >
          <Plus size={18} />
          NUEVO ROL
        </button>
      </div>

      {/* Contenedor de Tabla con Efecto Glass */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Nombre del Rol</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Permisos</th>
                <th className="px-6 py-5 text-right text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-gray-400 font-medium">
                    No hay roles configurados actualmente.
                  </td>
                </tr>
              ) : (
                roles.map((rol) => (
                  <tr key={rol._id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform">
                          <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                          {rol.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(rol.permissions|| {})
                          .filter(([_, v]) => v)
                          .map(([key]) => (
                            <span key={key} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 dark:border-gray-700 uppercase">
                              {key.replace(/Usuarios|Dashboard|Stock/g, '')}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => openModal(rol)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-white dark:hover:bg-gray-800 shadow-none hover:shadow-md transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(rol._id, rol.name)}
                          className="p-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-white dark:hover:bg-gray-800 shadow-none hover:shadow-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RoleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={selectedRole}
      />
    </div>
  );
}