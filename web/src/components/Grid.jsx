import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useTheme } from '../ThemeContext';

export default function Grid({ id, title, maxWeight }) {
  const { themeName } = useTheme();
  const { items, draggedItem, hoverState, setHoverState, handleDragStart, isValidPosition } = useInventory();
  const gridRef = useRef(null);

  // Filter items that belong to this grid
  const gridItems = items.filter(i => i.gridId === id);

  // Theme styling helpers
  const getThemeStyles = () => {
    switch (themeName) {
      case 'pipboy': return { slotBg: "bg-transparent border border-[var(--primary-color)]/20", container: "bg-[#020502] border border-[var(--primary-color)]/30 rounded-sm" };
      case 'military': return { slotBg: "bg-[#1c201c] border border-[#2d332d]/30", container: "bg-[#141614] border-t-2 border-l-2 border-[#0a0b0a] border-b-2 border-r-2 border-[#2d332d] shadow-inner" };
      case 'urban': return { slotBg: "bg-zinc-900 border border-zinc-800", container: "bg-black border border-zinc-800" };
      case 'basic':
      default: return { slotBg: "bg-white/5 border border-white/5 rounded-[2px]", container: "bg-zinc-950/50 border border-white/5 rounded-lg shadow-inner" };
    }
  };
  const t = getThemeStyles();

  // Handle cell enter for ghost item positioning
  const handleCellEnter = (x, y) => {
    if (draggedItem) {
      setHoverState({ gridId: id, x, y });
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full relative pointer-events-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-black tracking-widest uppercase ${themeName === 'basic' ? 'text-gray-100' : 'text-[var(--primary-color)]'}`}>
          {title}
        </h2>
        <div className="bg-black/50 px-4 py-1.5 rounded border border-white/5 shadow-inner">
          <span className="text-xs font-bold tracking-wider text-gray-500">0.0 <span className="opacity-50">/</span> {maxWeight} KG</span>
        </div>
      </div>

      {/* Grid Matrix */}
      <div 
        ref={gridRef}
        className={`flex-1 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 relative ${t.container}`}
        onMouseLeave={() => draggedItem && setHoverState(null)}
      >
        {/* Render 100 Background Slots */}
        {Array.from({ length: 10 }).map((_, y) => 
          Array.from({ length: 10 }).map((_, x) => (
            <div 
              key={`slot-${x}-${y}`} 
              className={`w-full h-full relative transition-colors ${t.slotBg}`}
              onMouseEnter={() => handleCellEnter(x, y)}
            ></div>
          ))
        )}

        {/* Render Actual Items */}
        {gridItems.map(item => {
          // If this is the item currently being dragged, hide its original body in the grid
          if (draggedItem && draggedItem.id === item.id) return null;

          const w = item.rotated ? item.height : item.width;
          const h = item.rotated ? item.width : item.height;

          return (
            <div 
              key={item.id}
              onMouseDown={(e) => handleDragStart(item, e)}
              className="absolute z-10 p-[2px] cursor-pointer"
              style={{
                left: `${(item.x / 10) * 100}%`,
                top: `${(item.y / 10) * 100}%`,
                width: `${(w / 10) * 100}%`,
                height: `${(h / 10) * 100}%`,
              }}
            >
              <div 
                className="w-full h-full border rounded-sm flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: `${item.bg}80`, borderColor: item.bg }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <span className="text-xs font-black tracking-widest drop-shadow-lg z-10 text-white" style={{ writingMode: item.rotated ? 'vertical-rl' : 'horizontal-tb' }}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Render Ghost Item (Preview) */}
        {draggedItem && hoverState && hoverState.gridId === id && (
          <div
            className="absolute z-20 p-[2px] pointer-events-none transition-all duration-75"
            style={{
              left: `${(hoverState.x / 10) * 100}%`,
              top: `${(hoverState.y / 10) * 100}%`,
              width: `${((draggedItem.rotated ? draggedItem.height : draggedItem.width) / 10) * 100}%`,
              height: `${((draggedItem.rotated ? draggedItem.width : draggedItem.height) / 10) * 100}%`,
            }}
          >
            <div 
              className={`w-full h-full border-2 rounded-sm ${isValidPosition(draggedItem, id, hoverState.x, hoverState.y, draggedItem.rotated) ? 'bg-green-500/30 border-green-400' : 'bg-red-500/30 border-red-400'}`}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
