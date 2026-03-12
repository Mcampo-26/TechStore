import { ArrowRight, Zap } from 'lucide-react';

export const PromoBanner = () => {
  return (
    // Reducimos el padding superior en mobile (pt-12) y el padding lateral del contenedor
    <div className="pt-12 md:pt-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* Ajustamos el borde y el redondeado para mobile */}
      <div className="relative w-full bg-[#0a0a0a] rounded-3xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/10">
        
        {/* Líneas de cuadrícula minimalistas */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px md:40px 40px' }}>
        </div>

        {/* --- CORRECCIÓN CLAVE: PADDINGS VERTICALES Y HORIZONTALES EN MOBILE --- */}
        {/* Usamos px-5 py-6 para compactar el banner en mobile */}
        <div className="relative flex flex-col md:flex-row items-center justify-between px-5 py-6 md:px-10 md:py-16">
          
          <div className="flex-1 text-center md:text-left">
            {/* Insignia más compacta en mobile (mb-3) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-6">
              <Zap size={10} className="md:w-[14px]" fill="currentColor" />
              Ofertas de Tiempo Limitado
            </div>
            
            {/* --- AJUSTE DE TÍTULO EXTREMO PARA MOBILE --- */}
            {/* Pasamos de 3xl a 2xl como base. text-2xl en mobile, 7xl en desktop. */}
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-7xl font-black text-white leading-[1] md:leading-[0.9] tracking-tighter">
              TECNOLOGÍA <br />
              <span className="text-slate-500">AL SIGUIENTE NIVEL.</span>
            </h2>
            
            {/* Párrafo más corto y con fuente más pequeña en mobile */}
            <p className="mt-3 md:mt-6 text-slate-400 text-xs md:text-lg max-w-sm md:max-w-md font-light leading-relaxed mx-auto md:mx-0">
              Equípate con lo mejor. Descuentos aplicados directamente en el carrito.
            </p>
          </div>

          {/* Margen superior más compacto en mobile (mt-6) */}
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-3 md:gap-4 w-full md:w-auto">
            
            {/* El porcentaje ahora es más sutil en mobile */}
            <div className="text-center md:text-right">
              <span className="text-3xl md:text-6xl font-light text-white italic tracking-tighter">40%</span>
              <span className="text-lg md:text-2xl font-bold text-blue-500 uppercase ml-1 md:ml-2 italic">Off</span>
            </div>
            
            {/* Botón más compacto y responsivo: full width en mobile, auto en desktop */}
            <button className="group relative flex items-center justify-center gap-3 bg-white text-black w-full md:w-auto px-6 md:px-10 py-3.5 md:py-5 rounded-full font-bold text-sm md:text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl">
              Explorar Catálogo
              {/* Icono más pequeño para mobile */}
              <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>

        </div>

        {/* Detalle de luz */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[100px] md:blur-[120px] pointer-events-none"></div>
      </div>
    </div>
  );
};