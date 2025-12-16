import React from 'react';
import { Gamepad2, Lock, Skull, Ghost, Binary, Play, Clock, User } from 'lucide-react';

interface MainMenuProps {
  onSelect: (roomId: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Share_Tech_Mono'] flex flex-col items-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="crt-overlay absolute inset-0 z-20 pointer-events-none"></div>
      <div className="scanline pointer-events-none z-20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(20deg)'
      }}></div>

      {/* Header */}
      <header className="z-30 pt-12 pb-8 text-center animate-glitch">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
          NEXUS DE ESCAPE
        </h1>
        <p className="text-green-500/70 text-sm tracking-[0.5em] uppercase">Selecciona tu simulación</p>
      </header>

      {/* Room Grid */}
      <div className="z-30 flex-1 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 overflow-y-auto">
        
        {/* ROOM 1: ACTIVE */}
        <div 
            onClick={() => onSelect('room1')}
            className="group relative h-80 bg-black border border-green-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/nightmare/800/600')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <div className="absolute top-4 right-4 bg-green-900/80 text-green-300 px-3 py-1 text-xs rounded border border-green-500 backdrop-blur-sm">
                DISPONIBLE
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="flex items-center gap-3 mb-2 text-green-400">
                    <Skull size={24} />
                    <span className="text-xs uppercase tracking-widest border border-green-800 px-2 py-0.5 bg-black">Thriller Psicológico</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">El Juego Que No Debía Ganarse</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">Una evaluación infantil se convierte en una pesadilla digital. ¿Podrás escapar del aislamiento cognitivo?</p>
                <div className="flex items-center text-green-500 text-sm font-bold group-hover:translate-x-2 transition-transform">
                    INICIAR SIMULACIÓN <Play size={16} className="ml-2 fill-current" />
                </div>
            </div>
        </div>

        {/* ROOM 2: LOCKED */}
        <LockedRoom 
            title="Protocolo: Sombras" 
            genre="Terror Sobrenatural"
            desc="La oscuridad tiene memoria. No mires atrás."
            icon={<Ghost size={24} />}
        />

        {/* ROOM 3: LOCKED */}
        <LockedRoom 
            title="Código Rojo: Bunker" 
            genre="Supervivencia"
            desc="El oxígeno se acaba. La confianza también."
            icon={<Binary size={24} />}
        />

        {/* ROOM 4: LOCKED */}
        <LockedRoom 
            title="La Paradoja de Viena" 
            genre="Misterio Histórico"
            desc="Un crimen que no ha sucedido todavía."
            icon={<Clock size={24} />}
        />

        {/* ROOM 5: LOCKED */}
        <LockedRoom 
            title="Sujeto 8: El Origen" 
            genre="Sci-Fi / Horror"
            desc="Antes del 7, hubo otro."
            icon={<User size={24} />}
        />

      </div>

      {/* Footer */}
      <footer className="z-30 w-full py-4 text-center border-t border-green-900/30 bg-black/80 backdrop-blur-sm">
        <p className="text-[10px] text-green-800 uppercase tracking-widest">System v2.0.4 // Connection Secure</p>
      </footer>
    </div>
  );
};

// Helper component for locked rooms
const LockedRoom = ({ title, genre, desc, icon }: { title: string, genre: string, desc: string, icon: React.ReactNode }) => (
    <div className="relative h-80 bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden opacity-70 grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed group">
        <div className="absolute inset-0 flex items-center justify-center z-20">
            <Lock size={48} className="text-gray-600 mb-8 group-hover:text-red-500 transition-colors" />
        </div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 opacity-40">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
                {icon}
                <span className="text-xs uppercase tracking-widest border border-gray-800 px-2 py-0.5">Bloqueado</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-400">{title}</h2>
            <p className="text-gray-600 text-sm">{desc}</p>
        </div>
        <div className="absolute top-4 right-4 bg-red-900/20 text-red-700 px-3 py-1 text-xs rounded border border-red-900/30">
            EN DESARROLLO
        </div>
    </div>
);

export default MainMenu;