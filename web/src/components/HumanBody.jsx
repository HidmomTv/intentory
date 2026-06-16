import React from 'react';
import { Shirt, Shield, Backpack, Glasses, Footprints, Watch, Scissors, CircleUser, Gem, Link } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const equipSlots = [
  { id: 'head', label: 'CABEZA', icon: CircleUser, pos: 'top-2 left-2' },
  { id: 'mask', label: 'MÁSCARA', icon: Scissors, pos: 'top-[4.5rem] left-2' },
  { id: 'glasses', label: 'GAFAS', icon: Glasses, pos: 'top-[8.5rem] left-2' },
  { id: 'earrings', label: 'PENDIENTES', icon: Gem, pos: 'top-[12.5rem] left-2' },
  
  { id: 'torso', label: 'CAMISA', icon: Shirt, pos: 'top-2 right-2' },
  { id: 'armor', label: 'CHALECO', icon: Shield, pos: 'top-[4.5rem] right-2' },
  { id: 'bag', label: 'MOCHILA', icon: Backpack, pos: 'top-[8.5rem] right-2' },
  { id: 'bracelets', label: 'BRAZALETES', icon: Link, pos: 'top-[12.5rem] right-2' },
  
  { id: 'watch', label: 'RELOJ', icon: Watch, pos: 'bottom-2 left-2' },
  { id: 'legs', label: 'PANTALÓN', icon: Shirt, pos: 'bottom-[4.5rem] left-2', rotateIcon: true },
  { id: 'feet', label: 'ZAPATOS', icon: Footprints, pos: 'bottom-2 right-2' },
];

export default function Equipment() {
  const { themeName } = useTheme();

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center mt-2">
      
      {/* Central detailed silhouette or holographic avatar */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 400" className="h-[95%] w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <path d="M100 20 C115 20 120 35 120 45 C120 55 110 65 100 65 C90 65 80 55 80 45 C80 35 85 20 100 20 Z" fill="currentColor" />
          <path d="M80 75 L120 75 L140 180 L120 190 L80 190 L60 180 Z" fill="currentColor" />
          <path d="M55 85 L35 170 L45 180 L65 120 Z" fill="currentColor" />
          <path d="M145 85 L165 170 L155 180 L135 120 Z" fill="currentColor" />
          <path d="M85 200 L70 360 L85 370 L100 220 Z" fill="currentColor" />
          <path d="M115 200 L130 360 L115 370 L100 220 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Equipment Slots */}
      {equipSlots.map((slot) => {
        const Icon = slot.icon;
        return (
          <div 
            key={slot.id} 
            className={`absolute ${slot.pos} w-[4.5rem] h-[3.8rem] bg-black/60 border border-white/5 rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[var(--primary-color)]/20 hover:border-[var(--primary-color)] transition-all group overflow-hidden shadow-lg backdrop-blur-md`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon size={20} className={`text-gray-400 group-hover:text-[var(--primary-color)] transition-colors ${slot.rotateIcon ? 'rotate-180' : ''}`} />
            <span className="text-[8px] font-bold tracking-widest text-gray-500 group-hover:text-white z-10">{slot.label}</span>
          </div>
        );
      })}
    </div>
  );
}
