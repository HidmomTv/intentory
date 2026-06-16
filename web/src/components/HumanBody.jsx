import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function HumanBody() {
  const { themeName } = useTheme();
  const [hoveredPart, setHoveredPart] = useState(null);
  
  // Theme-specific styles for the SVG
  const getThemeStyles = () => {
    switch(themeName) {
      case 'pipboy':
        return {
          base: "fill-[#0a140a] stroke-[#1bf222] stroke-2",
          hover: "fill-[#1bf222]/30 stroke-[#1bf222] drop-shadow-[0_0_10px_rgba(27,242,34,0.8)]",
          glow: "drop-shadow-[0_0_5px_rgba(27,242,34,0.5)]"
        };
      case 'military':
        return {
          base: "fill-[#2d332d] stroke-[#4a544a] stroke-2",
          hover: "fill-[#4a544a]/50 stroke-[#a3b3a3] drop-shadow-[0_0_8px_rgba(163,179,163,0.5)]",
          glow: "drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
        };
      case 'urban':
        return {
          base: "fill-black stroke-white stroke-[3px] stroke-dasharray-[5_5]",
          hover: "fill-[var(--primary-color)]/20 stroke-[var(--primary-color)] stroke-solid drop-shadow-[4px_4px_0_var(--primary-color)]",
          glow: ""
        };
      case 'basic':
      default:
        return {
          base: "fill-black/40 stroke-white/20 stroke-1",
          hover: "fill-[var(--primary-color)]/20 stroke-[var(--primary-color)] drop-shadow-[0_0_15px_var(--primary-glow)]",
          glow: "drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        };
    }
  };

  const s = getThemeStyles();

  const handleEquip = (part) => {
    console.log("Toggling equipment for:", part);
    // Trigger NUI Callback to lua here later
  };

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${s.glow}`}>
      <svg 
        viewBox="0 0 200 400" 
        className="w-full h-full max-h-[300px] cursor-pointer"
        style={{ filter: themeName === 'pipboy' ? 'contrast(1.2)' : 'none' }}
      >
        {/* Head */}
        <path 
          d="M100 20 C115 20 125 35 125 50 C125 65 115 80 100 80 C85 80 75 65 75 50 C75 35 85 20 100 20 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'head' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('head')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('head')}
        />
        {/* Torso */}
        <path 
          d="M75 90 L125 90 L135 180 L120 220 L80 220 L65 180 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'torso' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('torso')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('torso')}
        />
        {/* Left Arm */}
        <path 
          d="M65 95 L40 160 L45 200 L65 180 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'arms' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('arms')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('arms')}
        />
        {/* Right Arm */}
        <path 
          d="M135 95 L160 160 L155 200 L135 180 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'arms' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('arms')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('arms')}
        />
        {/* Left Leg */}
        <path 
          d="M80 230 L60 340 L75 380 L95 230 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'legs' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('legs')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('legs')}
        />
        {/* Right Leg */}
        <path 
          d="M120 230 L140 340 L125 380 L105 230 Z" 
          className={`transition-all duration-300 ${hoveredPart === 'legs' ? s.hover : s.base}`}
          onMouseEnter={() => setHoveredPart('legs')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => handleEquip('legs')}
        />
      </svg>
      {/* Tooltip Overlay */}
      <div className="absolute bottom-[-10px] bg-black/80 px-3 py-1 rounded text-xs text-white border border-white/20 uppercase tracking-widest min-w-[120px] text-center pointer-events-none transition-opacity duration-300" style={{ opacity: hoveredPart ? 1 : 0 }}>
        {hoveredPart === 'head' && 'Máscara / Casco'}
        {hoveredPart === 'torso' && 'Chaqueta / Chaleco'}
        {hoveredPart === 'arms' && 'Guantes / Reloj'}
        {hoveredPart === 'legs' && 'Pantalones'}
      </div>
    </div>
  );
}
