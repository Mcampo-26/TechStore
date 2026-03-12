import { ArrowRight, Zap } from 'lucide-react';

export const PromoBanner = () => {
  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <div className="relative w-full bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10">
        
        {/* Líneas de cuadrícula minimalistas (opcional) */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between px-10 py-12 md:py-16">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} fill="currentColor" />
              Ofertas de Tiempo Limitado
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              TECNOLOGÍA <br />
              <span className="text-slate-500">AL SIGUIENTE NIVEL.</span>
            </h2>
            
            <p className="mt-6 text-slate-400 text-lg max-w-md font-light leading-relaxed">
              Equípate con lo mejor. Descuentos aplicados directamente en el carrito en productos seleccionados.
            </p>
          </div>

          <div className="mt-10 md:mt-0 flex flex-col items-center md:items-end gap-4">
            <div className="text-right hidden md:block">
              <span className="text-6xl font-light text-white italic tracking-tighter">40%</span>
              <span className="text-2xl font-bold text-blue-500 uppercase ml-2 italic">Off</span>
            </div>
            
            <button className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-2xl">
              Explorar Catálogo
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

        </div>

        {/* Un detalle de luz muy sutil en la esquina inferior */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
};