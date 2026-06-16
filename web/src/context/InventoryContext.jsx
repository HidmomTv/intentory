import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  // Mock data for initial testing
  const [items, setItems] = useState([
    { id: 'item-1', gridId: 'personal', type: 'weapon', width: 4, height: 2, x: 0, y: 0, rotated: false, label: 'RIFLE ASALTO', bg: 'var(--primary-color)' },
    { id: 'item-2', gridId: 'personal', type: 'consumable', width: 1, height: 1, x: 5, y: 0, rotated: false, label: 'AGUA', bg: '#10b981' },
    { id: 'item-3', gridId: 'loot', type: 'material', width: 2, height: 2, x: 1, y: 1, rotated: false, label: 'CHATARRA', bg: '#6b7280' }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [hoverState, setHoverState] = useState(null); // { gridId, x, y }
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle global mouse movement for the ghost item
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedItem) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        if (draggedItem) {
          setDraggedItem(prev => ({ ...prev, rotated: !prev.rotated }));
        }
      }
    };

    const handleMouseUp = () => {
      if (draggedItem) {
        handleDrop();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedItem, hoverState]);

  // Collision detection logic
  const isValidPosition = (item, gridId, startX, startY, rotated) => {
    const w = rotated ? item.height : item.width;
    const h = rotated ? item.width : item.height;

    // Check bounds (assuming 10x10 grid)
    if (startX < 0 || startX + w > 10 || startY < 0 || startY + h > 10) return false;

    // Check overlaps
    for (let x = startX; x < startX + w; x++) {
      for (let y = startY; y < startY + h; y++) {
        const overlappingItem = items.find(i => {
          if (i.id === item.id) return false; // Ignore self
          if (i.gridId !== gridId) return false;
          const iw = i.rotated ? i.height : i.width;
          const ih = i.rotated ? i.width : i.height;
          return x >= i.x && x < i.x + iw && y >= i.y && y < i.y + ih;
        });
        if (overlappingItem) return false;
      }
    }
    return true;
  };

  const handleDragStart = (item, e) => {
    // Prevent default drag behaviors
    e.preventDefault();
    setDraggedItem(item);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleDrop = () => {
    if (draggedItem && hoverState) {
      if (isValidPosition(draggedItem, hoverState.gridId, hoverState.x, hoverState.y, draggedItem.rotated)) {
        // Apply new position
        setItems(prev => prev.map(i => 
          i.id === draggedItem.id 
            ? { ...i, gridId: hoverState.gridId, x: hoverState.x, y: hoverState.y, rotated: draggedItem.rotated } 
            : i
        ));
      }
    }
    setDraggedItem(null);
    setHoverState(null);
  };

  const value = {
    items,
    draggedItem,
    hoverState,
    mousePos,
    setHoverState,
    handleDragStart,
    isValidPosition
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
