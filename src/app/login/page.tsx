import { LoginForm } from '@/components/auth/LoginForm';
import { Laptop } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-blue-600 text-white p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <Laptop size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">HOLA DE NUEVO</h1>
          <p className="text-slate-400 text-sm">Tu setup tech te está esperando.</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 font-bold hover:underline">Crea una ahora</a>
        </p>
      </div>
    </div>
  );
}