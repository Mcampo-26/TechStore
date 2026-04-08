"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  Users, Activity, DollarSign, Cpu, 
  ShoppingCart, Wrench, BarChart3, Star,
  Database, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

// Datos para el gráfico
const data = [
  { name: 'Lun', sales: 4000 },
  { name: 'Mar', sales: 3000 },
  { name: 'Mie', sales: 2000 },
  { name: 'Jue', sales: 2780 },
  { name: 'Vie', sales: 1890 },
  { name: 'Sab', sales: 2390 },
  { name: 'Dom', sales: 3490 },
];

export const AdminDashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ ventas: 12540, usuarios: 842, productos: 124, rendimiento: 98.2 });
  const [logs, setLogs] = useState(["SISTEMA: Conexión cifrada", "STOCK: Repuestos actualizados"]);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNuevaVenta = () => {
    setStats(prev => ({ ...prev, ventas: prev.ventas + 320, usuarios: prev.usuarios + 1 }));
    setLogs(prev => [`VENTA_REPUESTO: +$320`, ...prev.slice(0, 3)]);
    setTriggerUpdate(p => p + 1);
    setIsAlertActive(true);
    setTimeout(() => setIsAlertActive(false), 500);
  };

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER: Limpio y Profesional */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-2xl text-blue-600 border border-slate-200">
              <Cpu size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
                SpareParts<span className="text-blue-600">HUB</span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">Gestión de Inventario v3.5</p>
            </div>
          </div>

          <button 
            onClick={handleNuevaVenta}
            className={`group relative px-10 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest overflow-hidden shadow-sm active:scale-95 ${
              isAlertActive 
                ? 'bg-red-600 text-white scale-95 shadow-lg' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="relative z-10 flex items-center gap-3"> <ShoppingCart size={18}/> Registrar Venta </span>
          </button>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* PANEL IZQUIERDO: POPULARIDAD */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <Star size={14} className="text-amber-400" /> Repuestos Destacados
            </h3>
            
            <div className="relative flex justify-center py-4">
              <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="80" className="stroke-slate-100" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  cx="96" cy="96" r="80" className="stroke-blue-600" strokeWidth="12" fill="transparent" 
                  strokeDasharray="502" 
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (502 * (65 + (triggerUpdate % 5))) / 100 }}
                  transition={{ duration: 1 }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 italic">
                  <CountUp end={65} suffix="%" duration={1} />
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Demanda de Stock</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
               <PopularItem label="Motores Brushless" percent={88} color="bg-blue-600" />
               <PopularItem label="Controladoras FPV" percent={72} color="bg-slate-400" />
               <PopularItem label="Hélices Carbono" percent={94} color="bg-emerald-500" />
            </div>
          </div>

          {/* PANEL DERECHO: MÉTRICAS Y GRÁFICO */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <MiniMetric label="Total Facturado" val={stats.ventas} prefix="$" icon={DollarSign} />
               <MiniMetric label="Clientes" val={stats.usuarios} icon={Users} />
               <MiniMetric label="Eficiencia" val={stats.rendimiento} suffix="%" icon={Activity} />
            </div>

            {/* GRÁFICO TÉCNICO LIMPIO */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm min-h-[400px]">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-10">
                 <BarChart3 size={16} className="text-blue-600"/> Flujo de Ventas Real-Time
               </h3>

               <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#1e293b'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* HISTORIAL TERMINAL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner">
               <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Wrench size={14} /> Historial Operativo_
               </div>
               <div className="space-y-2">
                 <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={`${log}-${i}`}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center text-[11px] border-b border-slate-800 py-1.5"
                      >
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-slate-200 font-medium italic">{log}</span>
                        <span className="text-emerald-500 font-bold">OK</span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* HUD FOOTER */}
        <footer className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><Database size={14}/> DB_SYNC: Nominal</span>
              <span className="flex items-center gap-2"><ShieldAlert size={14}/> Seguridad: Activa</span>
            </div>
            <div className="text-blue-600">ID Sesión: MAURICIO_ADMIN_S01</div>
        </footer>

      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const MiniMetric = ({ label, val, icon: Icon, prefix = "", suffix = "" }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
    <div className="flex justify-between items-start mb-2">
       <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
       <Icon size={16} className="text-blue-600 opacity-40 group-hover:opacity-100" />
    </div>
    <div className="text-3xl font-black text-slate-900 italic">
      {prefix}<CountUp end={val} duration={1} separator="," decimals={suffix === '%' ? 1 : 0} />{suffix}
    </div>
  </div>
);

const PopularItem = ({ label, percent, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase italic text-slate-600">
      <span>{label}</span>
      <span className="text-blue-600">{percent}%</span>
    </div>
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${percent}%` }} 
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

export default AdminDashboard;