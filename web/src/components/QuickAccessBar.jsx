import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { useTheme } from '../ThemeContext';

const getResolvedImage = (item) => {
  if (!item) return '';
  if (item.image && (item.image.startsWith('http') || item.image.startsWith('nui://') || item.image.startsWith('data:'))) return item.image;
  const rawImg = item.image || `${item.name}.png`;
  if (rawImg.includes('/')) return rawImg;
  return `assets/icons/${rawImg}`;
};

export default function QuickAccessBar() {
  const { themeName } = useTheme();
  const { items, draggedItem, handleQuickbarAssign, handleQuickbarRemove } = useInventory();

  // Filtramos ítems que tienen asignado hotbarSlot (1 al 6)
  const quickItems = items.filter(i => i.hotbarSlot && i.hotbarSlot >= 1 && i.hotbarSlot <= 6);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropSlot = (slotIndex) => {
    if (draggedItem) {
      handleQuickbarAssign(draggedItem, slotIndex);
    }
  };

  const handleClickSlot = (item) => {
    if (!item) return;
    if (window.invokeNative) {
      fetch(`https://${GetParentResourceName()}/UseItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
    } else {
      console.log("Usando ítem rápido:", item.name);
    }
  };

  const handleContextMenuSlot = (e, item) => {
    e.preventDefault();
    if (item) {
      handleQuickbarRemove(item);
    }
  };

  return (
    <div className="w-full grid grid-cols-6 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 shadow-inner">
      {Array.from({ length: 6 }).map((_, i) => {
        const slotNum = i + 1;
        const slotItem = quickItems.find(item => item.hotbarSlot === slotNum);

        return (
          <div
            key={`quickslot-${slotNum}`}
            onDragOver={handleDragOver}
            onMouseUp={(e) => {
              if (draggedItem) {
                e.stopPropagation();
                handleDropSlot(slotNum);
              }
            }}
            onClick={() => slotItem && handleClickSlot(slotItem)}
            onContextMenu={(e) => handleContextMenuSlot(e, slotItem)}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 group overflow-hidden ${slotItem ? 'bg-zinc-800/90 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.25)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
          >
            {/* Indicador de Número de Slot */}
            <div className="absolute top-0.5 left-1 z-20">
              <span className={`text-[9px] font-black font-mono ${slotItem ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                {slotNum}
              </span>
            </div>

            {/* Render del Objeto */}
            {slotItem ? (
              <>
                {(slotItem.image || slotItem.name) && (
                  <img
                    src={getResolvedImage(slotItem)}
                    alt={slotItem.label}
                    className="w-[75%] h-[75%] object-contain drop-shadow-md z-10 group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = `https://cfx-nui-qb-inventory/web/dist/assets/icons/${slotItem.name}.png`;
                      } else {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                )}
                {slotItem.count > 1 && (
                  <div className="absolute bottom-0.5 right-0.5 bg-black/85 px-1 rounded text-[8px] font-black text-white z-20 border border-white/10">
                    {slotItem.count}
                  </div>
                )}
              </>
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-white/20 transition-colors"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
