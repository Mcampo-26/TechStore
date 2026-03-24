export default function Loading() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] transition-colors duration-500">
        
        {/* 1. Spinner Central Limpio */}
        <div className="relative mb-8">
          {/* Anillo de fondo sutil */}
          <div className="w-16 h-16 border-4 border-blue-600/10 rounded-full" />
          {/* Anillo animado principal */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
  
        {/* 2. Texto y Barra de Progreso Minimalista */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-black tracking-[0.5em] text-blue-600 uppercase italic animate-pulse">
            Preparando Experiencia
          </p>
          
          {/* Línea de carga técnica */}
          <div className="w-24 h-[1px] bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="w-full h-full bg-blue-600 animate-[loadingBar_1.5s_infinite_ease-in-out]" 
              style={{ animation: 'loadingBar 1.5s ease-in-out infinite' }}
            />
          </div>
        </div>
  
        {/* Inyección de Keyframes para la barra */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }