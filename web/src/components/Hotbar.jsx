import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';
import { useInventory } from '../context/InventoryContext';

export default function Hotbar() {
  const { themeName } = useTheme();
  const { items } = useInventory(); // Real items from QBCore
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'showHotbar') setIsVisible(true);
      else if (event.data.action === 'hideHotbar') setIsVisible(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isVisible) return null;

  // Theme styles specifically for the hotbar
  const getThemeClass = () => {
    switch (themeName) {
      case 'pipboy': return "bg-[#0a140a]/90 border-t-2 border-[var(--primary-color)] shadow-[0_-10px_20px_var(--primary-glow)] font-pipboy";
      case 'military': return "bg-[#2d332d]/95 border-t-4 border-[#1e221e] font-military";
      case 'urban': return "bg-black border-t-4 border-[var(--primary-color)] font-urban";
      case 'basic':
      default: return "bg-black/60 backdrop-blur-xl border-t border-white/10 font-basic";
    }
  };

  const getSlotClass = () => {
    switch (themeName) {
      case 'pipboy': return "border-[var(--primary-color)] text-[var(--primary-color)]";
      case 'military': return "border-[#1e221e] bg-[#252a25] text-[#e8eee8]";
      case 'urban': return "border-zinc-800 bg-zinc-900 text-white";
      case 'basic':
      default: return "border-white/20 bg-white/5 text-white shadow-[0_0_15px_var(--primary-glow)]";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-screen h-screen flex items-end justify-center pointer-events-none z-[100] pb-8">
      {/* Background radial blur */}
      <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

      <div className={`relative px-12 py-6 rounded-t-3xl flex gap-6 items-center pointer-events-auto transition-transform duration-300 animate-slide-up ${getThemeClass()}`}>
        
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-1 rounded-full border border-white/10 shadow-lg">
          <span className="text-xs tracking-widest text-gray-300 font-bold">ACCESOS RÁPIDOS</span>
        </div>

        {Array.from({ length: 6 }).map((_, i) => {
          const slotNum = i + 1;
          const slotItem = items.find(item => item.hotbarSlot === slotNum);

          return (
            <div 
              key={`quick-${i}`} 
              className={`w-20 h-20 rounded-xl border flex flex-col items-center justify-center relative hover:-translate-y-2 transition-all cursor-pointer group overflow-hidden ${getSlotClass()}`}
              style={{ 
                borderColor: themeName === 'basic' && !slotItem ? 'rgba(255,255,255,0.2)' : (themeName === 'basic' ? 'var(--primary-color)' : undefined)
              }}
            >
              <div className="absolute top-1 left-1 bg-black/80 w-5 h-5 rounded flex items-center justify-center z-20">
                <span className="text-[10px] font-bold opacity-80" style={{ color: themeName !== 'military' ? 'var(--primary-color)' : '#a3b3a3' }}>{slotNum}</span>
              </div>
              
              {slotItem && (
                <>
                  {slotItem.image && (
                    <img 
                      src={slotItem.image} 
                      alt={slotItem.label} 
                      className="absolute inset-0 m-auto w-[65%] h-[65%] object-contain opacity-80 drop-shadow-lg z-10 group-hover:scale-110 transition-transform"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <span className="absolute bottom-1 w-full text-center text-[9px] font-bold z-20 drop-shadow-md truncate px-1">
                    {slotItem.label}
                  </span>
                  {slotItem.count > 1 && (
                    <span className="absolute top-1 right-1 text-[10px] bg-black/80 px-1 rounded font-bold text-gray-300 z-20">
                      x{slotItem.count}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
