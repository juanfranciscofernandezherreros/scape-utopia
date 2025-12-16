import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'child' | 'system' | 'industrial' | 'minimal';
}

export const Button: React.FC<ButtonProps> = ({ variant, className = '', children, ...props }) => {
  const baseStyles = "px-6 py-3 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    // Scene 1: Pastel, soft, rounded
    child: "bg-[#FFD93D] hover:bg-[#FFE066] text-[#4D96FF] font-['Fredoka'] font-bold rounded-3xl shadow-[0_6px_0_#E6C229] hover:shadow-[0_8px_0_#E6C229] hover:-translate-y-1 text-xl border-4 border-white",
    
    // Scene 4: Acid Green, terminal, sharp
    system: "bg-black hover:bg-green-900/50 text-green-500 font-['Share_Tech_Mono'] border border-green-500 rounded-none tracking-widest uppercase text-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    
    // Scene 5: Metallic/Red, industrial, heavy
    industrial: "bg-slate-800 hover:bg-red-900/40 text-red-500 font-['Share_Tech_Mono'] border-2 border-slate-600 hover:border-red-500 rounded-sm tracking-widest uppercase text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]",
    
    // Scene 6: Minimal, stark black/white
    minimal: "bg-transparent hover:bg-white hover:text-black text-white border border-white font-['Inter'] tracking-[0.2em] text-xs uppercase transition-colors duration-500"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};