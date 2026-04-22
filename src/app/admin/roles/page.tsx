import ListaRoles from '@/components/admin/ListaRoles';

export default function RolesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Roles</h1>
      </div>
      <ListaRoles />
    </div>
  );
}