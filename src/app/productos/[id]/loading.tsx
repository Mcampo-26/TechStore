export default function Loading() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] transition-colors duration-500 overflow-hidden">
        
        {/* 1. Elemento Decorativo de Fondo (Aura) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
  
        {/* 2. Skeleton de la Imagen con Efecto Shimmer */}
        <div className="relative mb-12 group">
          <div className="w-64 h-64 bg-neutral-200 dark:bg-neutral-800/30 rounded-[3.5rem] border border-[var(--border-theme)] shadow-2xl relative overflow-hidden">
            {/* Reemplazamos styled-jsx con una clase animada de Tailwind */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" 
                 style={{ 
                   animation: 'shimmer 2s infinite',
                   backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' 
                 }} 
            />
          </div>
          
          {/* Badge de Carga Estilo "Ofertas" */}
          <div className="absolute -top-4 -right-4 animate-bounce">
            <div className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333] shadow-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.2em]">Sincronizando</span>
            </div>
          </div>
        </div>
        
        {/* 3. Spinner y Texto Core */}
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-[3px] border-blue-600/10 rounded-full" />
            <div className="absolute inset-0 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase italic animate-pulse">
              Preparando Experiencia
            </p>
            
            {/* Barra de progreso con animación nativa de Tailwind */}
            <div className="w-32 h-[2px] bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="w-full h-full bg-blue-600 animate-[loading_1.5s_easeInOut_infinite]" 
                   style={{ 
                     animation: 'loadingBar 1.5s ease-in-out infinite' 
                   }} 
              />
            </div>
          </div>
        </div>
  
        {/* Inyectamos los Keyframes globales para evitar el error de styled-jsx */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }