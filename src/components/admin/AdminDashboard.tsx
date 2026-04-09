"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  Cpu, ShoppingCart, BarChart3, Settings, Plus, Globe, 
  ShieldAlert, LayoutDashboard, Zap, Star, Database, Wrench, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const initialDemandData = [
  { time: '0h', real: 2100 }, { time: '4h', real: 3500 },
  { time: '8h', real: 2800 }, { time: '12h', real: 5100 },
  { time: '16h', real: 4200 }, { time: '20h', real: 6800 },
];

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const [rentabilidad, setRentabilidad] = useState(12.9);
  const [totalSales, setTotalSales] = useState(547);
  const [inventory, setInventory] = useState([
    { name: 'DJI Air 2S', stock: 79, color: 'bg-cyan-400', stroke: '#22d3ee' },
    { name: 'Skydio X10', stock: 71, color: 'bg-cyan-400', stroke: '#22d3ee' },
    { name: 'Autel EVO', stock: 64, color: 'bg-cyan-400', stroke: '#22d3ee' },
    { name: 'Repuestos', stock: 40, color: 'bg-red-500', stroke: '#ef4444' },
  ]);
  const [chartData, setChartData] = useState(initialDemandData);
  const [logs, setLogs] = useState<string[]>([
    "SISTEMA: Conexión cifrada",
    "STOCK: Repuestos actualizados",
    "NODE: Sincronización completa"
  ]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNuevaVenta = useCallback(() => {
    setIsSyncing(true);
    setRentabilidad(prev => Math.min(45, prev + 5.0));
    setTotalSales(prev => prev + 1);
    setInventory(prev => prev.map(item => ({
      ...item,
      stock: Math.max(5, item.stock - (Math.random() > 0.6 ? 1 : 0))
    })));
    setChartData(prev => {
      const newData = [...prev];
      const last = newData.length - 1;
      newData[last] = { ...newData[last], real: newData[last].real + 900 };
      return newData;
    });
    setLogs(prev => [`VENTA_REGISTRADA: +1 Unidad [${new Date().toLocaleTimeString()}]`, ...prev.slice(0, 4)]);
    setTimeout(() => setIsSyncing(false), 500);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full mx-auto space-y-6 relative z-10">
        
        {/* Header - Full Width */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-5 p-6 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-400/30">
              <Cpu className="text-cyan-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                Dron  <span className="text-cyan-400">Store</span>
              </h1>
              <p className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-bold">Gestión de Inventario Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={handleNuevaVenta}
              disabled={isSyncing}
              className="relative px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest overflow-hidden border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSyncing ? <Activity size={16} className="animate-spin" /> : <Plus size={16} />}
                {isSyncing ? 'Procesando...' : 'Registrar Venta'}
              </span>
            </button>
            <div className="text-3xl font-mono font-bold text-cyan-400 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour12: false })}
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="flex lg:flex-col gap-4">
            <NavIcon icon={LayoutDashboard} active />
            <NavIcon icon={Database} />
            <NavIcon icon={ShoppingCart} />
            <NavIcon icon={BarChart3} />
            <NavIcon icon={Settings} />
          </aside>

          {/* Main Content - Full Screen Grid */}
          <main className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Rendimiento */}
            <section className="bg-slate-800/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex items-center justify-around shadow-xl">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" className="stroke-slate-700" strokeWidth="10" fill="transparent" />
                  <motion.circle 
                    cx="50%" cy="50%" r="42%" className="stroke-cyan-500" strokeWidth="10" fill="transparent" 
                    strokeDasharray="100 100" 
                    animate={{ strokeDashoffset: 100 - rentabilidad * 2.5 }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white italic"><CountUp end={rentabilidad} decimals={1} />%</span>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Rentabilidad</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Ventas Totales</p>
                  <p className="text-3xl font-black text-white"><CountUp end={totalSales} /></p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                  <Zap size={14} className="animate-pulse" /> SISTEMA ONLINE
                </div>
              </div>
            </section>

            {/* Inventario */}
            <section className="bg-slate-800/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Database size={14} /> Niveles de Stock
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventory}>
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                    <Bar dataKey="stock" radius={[4, 4, 0, 0]} barSize={50}>
                      {inventory.map((entry, index) => (
                        <Cell key={index} fill={entry.stock < 50 ? '#ef4444' : '#06b6d4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {inventory.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-white">{item.stock}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${item.stock}%` }} className={`h-full ${item.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Logs */}
            <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-xl">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Wrench size={14} /> Terminal de Eventos
              </h3>
              <div className="space-y-3 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-cyan-500/50">[{currentTime.toLocaleTimeString()}]</span>
                    <span className="text-slate-200">{log}</span>
                    <span className="text-emerald-500 text-[9px] font-bold">OK</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Capital */}
            <section className="bg-slate-800/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <BarChart3 size={14} /> Flujo de Capital
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                    <XAxis dataKey="time" hide />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                    <Area type="monotone" dataKey="real" stroke="#06b6d4" strokeWidth={3} fill="url(#colorReal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

          </main>
        </div>

        <footer className="pt-6 border-t border-white/5 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Globe size={12}/> Global Node</span>
            <span className="flex items-center gap-2"><ShieldAlert size={12}/> Encrypted AES-256</span>
          </div>
          <span>Mauricio Admin Panel v5.1</span>
        </footer>
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
  return (
    <button className={`p-4 rounded-2xl transition-all border ${
      active ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
    }`}>
      <Icon size={22} />
    </button>
  );
}