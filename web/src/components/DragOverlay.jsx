import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function DragOverlay() {
  const { draggedItem, mousePos } = useInventory();

  if (!draggedItem) return null;

  // Assuming each cell is roughly 40x40 pixels for the floating visual
  // This is purely visual and follows the mouse cursor
  const cellPx = 45;
  const w = (draggedItem.rotated ? draggedItem.height : draggedItem.width) * cellPx;
  const h = (draggedItem.rotated ? draggedItem.width : draggedItem.height) * cellPx;

  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: mousePos.x,
        top: mousePos.y,
        width: w,
        height: h,
        transform: 'translate(-50%, -50%)', // Center on mouse
        opacity: 0.8
      }}
    >
      <div 
        className="w-full h-full border-2 rounded-sm flex flex-col items-center justify-center shadow-2xl scale-105"
        style={{ backgroundColor: `${draggedItem.bg}CC`, borderColor: 'white' }}
      >
        <span className="text-xs font-black tracking-widest drop-shadow-lg text-white" style={{ writingMode: draggedItem.rotated ? 'vertical-rl' : 'horizontal-tb' }}>
          {draggedItem.label}
        </span>
      </div>
    </div>
  );
}
