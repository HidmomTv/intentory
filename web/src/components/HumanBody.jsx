import React from 'react';
import { useTheme } from '../ThemeContext';
import { 
  GiVisoredHelm, GiGasMask, GiKevlarVest, GiTShirt, 
  GiBackpack, GiLeatherBoot, GiTrousers, GiGloves, 
  GiNecklace, GiHumanTarget
} from 'react-icons/gi';
import { FaGlasses } from 'react-icons/fa';
import { BsWatch } from 'react-icons/bs';

const equipSlots = [
  { id: 'head', label: 'CABEZA', icon: GiVisoredHelm, pos: 'top-2 left-2' },
  { id: 'mask', label: 'MÁSCARA', icon: GiGasMask, pos: 'top-[4.5rem] left-2' },
  { id: 'glasses', label: 'GAFAS', icon: FaGlasses, pos: 'top-[8.5rem] left-2' },
  { id: 'earrings', label: 'CADENA', icon: GiNecklace, pos: 'top-[12.5rem] left-2' },
  
  { id: 'torso', label: 'CAMISA', icon: GiTShirt, pos: 'top-2 right-2' },
  { id: 'armor', label: 'CHALECO', icon: GiKevlarVest, pos: 'top-[4.5rem] right-2' },
  { id: 'bag', label: 'MOCHILA', icon: GiBackpack, pos: 'top-[8.5rem] right-2' },
  { id: 'bracelets', label: 'GUANTES', icon: GiGloves, pos: 'top-[12.5rem] right-2' },
  
  { id: 'watch', label: 'RELOJ', icon: BsWatch, pos: 'bottom-2 left-2' },
  { id: 'legs', label: 'PANTALÓN', icon: GiTrousers, pos: 'bottom-[4.5rem] left-2' },
  { id: 'feet', label: 'ZAPATOS', icon: GiLeatherBoot, pos: 'bottom-2 right-2' },
];

export default function Equipment() {
  const { themeName } = useTheme();

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center mt-2">
      
      {/* Central detailed AAA silhouette from Game Icons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        <GiHumanTarget className="w-full h-[95%] text-gray-400" />
      </div>

      {/* Equipment Slots */}
      {equipSlots.map((slot) => {
        const Icon = slot.icon;
        return (
          <div 
            key={slot.id} 
            className={`absolute ${slot.pos} w-[4.5rem] h-[3.8rem] bg-black/60 border border-white/10 rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[var(--primary-color)]/20 hover:border-[var(--primary-color)] transition-all group overflow-hidden shadow-lg backdrop-blur-md`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon size={24} className="text-gray-400 group-hover:text-[var(--primary-color)] transition-colors drop-shadow-md" />
            <span className="text-[8px] font-bold tracking-widest text-gray-500 group-hover:text-white z-10">{slot.label}</span>
          </div>
        );
      })}
    </div>
  );
}
