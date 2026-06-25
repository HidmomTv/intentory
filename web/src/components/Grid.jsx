import React, { useRef, useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useTheme } from '../ThemeContext';
import ContextMenu from './ContextMenu';
import QuantityModal from './QuantityModal';

const getResolvedImage = (item) => {
  if (!item) return '';
  if (item.image && (item.image.startsWith('http') || item.image.startsWith('nui://') || item.image.startsWith('data:'))) return item.image;
  const rawImg = item.image || `${item.name}.png`;
  if (rawImg.includes('/')) return rawImg;
  return `assets/icons/${rawImg}`;
};

export default function Grid({ id, title, maxWeight, invType }) {
  const { themeName } = useTheme();
  const { items, draggedItem, hoverState, setHoverState, handleDragStart, isValidPosition } = useInventory();
  const gridRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [modalState, setModalState] = useState(null);

  const gridItems = items.filter(i => i.gridId === id);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleAction = (action, item) => {
    setContextMenu(null);
    if (action.startsWith('buy_')) {
      const qtyStr = action.replace('buy_', '');
      if (qtyStr === 'custom') {
        setModalState({ type: 'buy', item });
      } else {
        const buyQty = parseInt(qtyStr) || 1;
        if (window.invokeNative) {
          fetch(`https://${GetParentResourceName()}/BuyItem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shop: id, item, amount: buyQty })
          });
        }
      }
      return;
    }
    if (action === 'use') {
      if (window.invokeNative) {
        fetch(`https://${GetParentResourceName()}/UseItem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item })
        });
      }
    } else {
      setModalState({ type: action, item });
    }
  };

  const handleModalSubmit = (quantity, targetPlayerId) => {
    if (window.invokeNative && modalState) {
      if (modalState.type === 'buy') {
        fetch(`https://${GetParentResourceName()}/BuyItem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop: id, item: modalState.item, amount: quantity })
        });
        setModalState(null);
        return;
      }

      let endpoint = '';
      if (modalState.type === 'split') endpoint = 'SplitItem';
      if (modalState.type === 'drop') endpoint = 'DropItem';
      if (modalState.type === 'give') endpoint = 'GiveItem';
      
      fetch(`https://${GetParentResourceName()}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: modalState.item, amount: quantity, targetId: targetPlayerId })
      });
    }
    setModalState(null);
  };

  const getThemeStyles = () => {
    switch (themeName) {
      case 'pipboy': return { slotBg: "bg-[var(--primary-color)]/[0.05] border border-[var(--primary-color)]/25 rounded", container: "bg-[#060c06]/80 border border-[var(--primary-color)]/40 rounded-lg shadow-inner" };
      case 'military': return { slotBg: "bg-[#252c25]/60 border border-[#485448]/40 rounded", container: "bg-[#181c18]/80 border border-[#485448]/60 rounded-xl shadow-inner" };
      case 'urban': return { slotBg: "bg-slate-800/40 border border-[var(--primary-color)]/30 rounded", container: "bg-slate-950/70 border border-[var(--primary-color)]/50 rounded-xl shadow-inner" };
      case 'basic':
      default: return { slotBg: "bg-white/[0.05] border border-white/10 rounded-[3px] hover:bg-white/[0.12]", container: "bg-slate-950/60 border border-white/20 rounded-xl shadow-inner backdrop-blur-md" };
    }
  };
  const t = getThemeStyles();

  const handleCellEnter = (x, y) => {
    if (draggedItem) {
      setHoverState({ gridId: id, x, y });
    }
  };

  const currentWeight = gridItems.reduce((acc, i) => acc + ((i.weight || 0) * (i.count || 1)), 0);

  return (
    <div className="flex-1 flex flex-col w-full h-full relative pointer-events-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-1">
        <h2 className={`text-xl font-black tracking-widest uppercase ${themeName === 'basic' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-[var(--primary-color)]'}`}>
          {title}
        </h2>
        <div className="bg-slate-800/90 px-4 py-2 rounded-xl border border-white/20 shadow-lg backdrop-blur-md">
          <span className="text-xs font-black tracking-wider text-white drop-shadow">
            {(currentWeight / 1000).toFixed(1)} <span className="text-emerald-400 opacity-80">/</span> {maxWeight} KG
          </span>
        </div>
      </div>

      <div 
        className={`flex-1 w-full relative overflow-y-auto overflow-x-hidden custom-scrollbar ${t.container} p-1`}
      >
        <div 
          ref={gridRef}
          className="w-full aspect-square grid grid-cols-10 grid-rows-10 gap-[1px] relative"
          onMouseLeave={() => draggedItem && setHoverState(null)}
        >
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
          if (draggedItem && draggedItem.id === item.id) return null;

          const w = item.rotated ? item.height : item.width;
          const h = item.rotated ? item.width : item.height;

          return (
            <div 
              key={item.id}
              onMouseDown={(e) => {
                if (invType === 'shop') {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, item });
                  return;
                }
                handleDragStart(item, e);
              }}
              onMouseEnter={() => handleCellEnter(item.x, item.y)}
              onContextMenu={(e) => handleContextMenu(e, item)}
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
                
                {item.image || item.name ? (
                  <img 
                    src={getResolvedImage(item)} 
                    alt={item.label} 
                    className={`w-[80%] h-[80%] object-contain z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] brightness-[1.2] pointer-events-none transition-transform group-hover:scale-110 ${item.rotated ? '-rotate-90' : ''}`}
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = `https://cfx-nui-qb-inventory/web/dist/assets/icons/${item.name}.png`;
                      } else {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs font-black tracking-widest drop-shadow-lg z-10 text-white" style={{ writingMode: item.rotated ? 'vertical-rl' : 'horizontal-tb' }}>
                    {item.label}
                  </span>
                )}

                {/* Amount / Count display */}
                {item.count && item.count > 1 && (
                  <div className="absolute top-1 right-1 w-max h-max px-1.5 py-0.5 bg-black/85 backdrop-blur-md rounded text-[10px] font-mono font-bold text-amber-300 border border-white/15 z-30 leading-none shadow pointer-events-none select-none">
                    x{item.count}
                  </div>
                )}
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
      
      {/* Portals / Overlays */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          item={contextMenu.item} 
          invType={invType}
          onClose={() => setContextMenu(null)} 
          onAction={handleAction} 
        />
      )}

      {modalState && (
        <QuantityModal 
          title={modalState.type === 'drop' ? 'Tirar Objeto' : modalState.type === 'give' ? 'Transferir a Jugador' : 'Dividir Objeto'} 
          item={modalState.item} 
          maxAmount={modalState.item.count} 
          isGive={modalState.type === 'give'}
          onSubmit={handleModalSubmit} 
          onClose={() => setModalState(null)} 
        />
      )}
    </div>
  );
}
