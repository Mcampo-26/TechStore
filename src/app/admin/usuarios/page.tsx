import { ListaUsuarios } from "@/components/admin/ListaUsuarios";

export default function UsuariosPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Aquí podrías poner tu Navbar antes de la lista */}
      <ListaUsuarios />
    </main>
  );
}