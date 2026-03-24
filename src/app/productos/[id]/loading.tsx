export default function Loading() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        {/* Skeleton de la imagen */}
        <div className="w-64 h-64 bg-neutral-200 dark:bg-neutral-800/50 animate-pulse rounded-[3rem] mb-8" />
        
        {/* Texto de carga con tu estilo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase animate-pulse">
            Preparando Experiencia...
          </p>
        </div>
      </div>
    );
  }