import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoverState, setHoverState] = useState(null);

  const parseQBCoreItems = (qbItems, targetGridId) => {
    const itemsArray = Array.isArray(qbItems) ? qbItems : Object.values(qbItems || {});
    const validItems = itemsArray.filter(i => i && i.name);
    
    const virtualGrid = Array(100).fill().map(() => Array(10).fill(false));
    
    const isSpaceFree = (x, y, w, h) => {
      if (x + w > 10 || y + h > virtualGrid.length) return false;
      for (let row = y; row < y + h; row++) {
        for (let col = x; col < x + w; col++) {
          if (virtualGrid[row][col]) return false;
        }
      }
      return true;
    };

    const markSpace = (x, y, w, h) => {
      for (let row = y; row < y + h; row++) {
        if (!virtualGrid[row]) virtualGrid[row] = Array(10).fill(false);
        for (let col = x; col < x + w; col++) {
          virtualGrid[row][col] = true;
        }
      }
    };

    return validItems.map(item => {
      const tetrisData = item.info && item.info.tetris ? item.info.tetris : null;
      const hotbarSlot = item.info && item.info.hotbarSlot ? item.info.hotbarSlot : (item.hotbarSlot || null);
      
      let originalW = 1;
      let originalH = 1;
      
      if (item.name.includes('weapon_')) {
        if (item.name.includes('pistol') || item.name.includes('stun')) { originalW = 2; originalH = 2; }
        else if (item.name.includes('smg') || item.name.includes('shotgun')) { originalW = 3; originalH = 2; }
        else if (item.name.includes('rifle') || item.name.includes('sniper')) { originalW = 4; originalH = 2; }
        else { originalW = 3; originalH = 2; }
      }
      else if (item.name.includes('water') || item.name.includes('beer')) { originalW = 1; originalH = 2; }
      else if (item.name.includes('phone') || item.name.includes('radio')) { originalW = 1; originalH = 2; }
      else if (item.name.includes('kit') || item.name.includes('bag')) { originalW = 2; originalH = 2; }
      else if (item.name.includes('burger') || item.name.includes('sandwich')) { originalW = 1; originalH = 1; }
      
      let finalX = 0;
      let finalY = 0;
      let isRotated = false;

      if (tetrisData) {
        finalX = tetrisData.x;
        finalY = tetrisData.y;
        isRotated = tetrisData.rotated || false;
        const currentW = isRotated ? originalH : originalW;
        const currentH = isRotated ? originalW : originalH;
        markSpace(finalX, finalY, currentW, currentH);
      } else {
        let placed = false;
        for (let r = 0; r < virtualGrid.length && !placed; r++) {
          for (let c = 0; c < 10 && !placed; c++) {
            if (isSpaceFree(c, r, originalW, originalH)) {
              finalX = c; finalY = r; isRotated = false; placed = true;
              markSpace(c, r, originalW, originalH);
            } else if (originalW !== originalH && isSpaceFree(c, r, originalH, originalW)) {
              finalX = c; finalY = r; isRotated = true; placed = true;
              markSpace(c, r, originalH, originalW);
            }
          }
        }
      }

      return {
        id: `${targetGridId}-${item.slot || Math.random()}`,
        name: item.name,
        label: item.label || item.name,
        count: item.amount || item.count || 1,
        weight: item.weight || 0,
        type: item.type || 'item',
        slot: item.slot,
        qbslot: item.slot,
        info: item.info || {},
        bg: item.name.includes('weapon_') ? '#ef4444' : item.type === 'food' ? '#f59e0b' : '#3b82f6',
        image: item.image ? `images/${item.image}` : `images/${item.name}.png`,
        width: isRotated ? originalH : originalW,
        height: isRotated ? originalW : originalH,
        originalWidth: originalW,
        originalHeight: originalH,
        x: finalX,
        y: finalY,
        rotated: isRotated,
        gridId: targetGridId,
        hotbarSlot: hotbarSlot
      };
    });
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'setItems') {
        const parsedPersonal = parseQBCoreItems(event.data.payload || [], 'personal');
        setItems(prev => {
          const others = prev.filter(i => i.gridId !== 'personal');
          return [...parsedPersonal, ...others];
        });
      } else if (event.data.action === 'openLoot' || event.data.action === 'openContainer') {
        const secId = event.data.containerId || 'loot';
        const parsedSec = parseQBCoreItems(event.data.items || [], secId);
        setItems(prev => {
          const personal = prev.filter(i => i.gridId === 'personal');
          return [...personal, ...parsedSec];
        });
      } else if (event.data.action === 'closeSecondaryDrop') {
        setItems(prev => prev.filter(i => i.gridId === 'personal'));
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
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
    if (startX < 0 || startY < 0) return false;
    const w = rotated ? item.originalHeight : item.originalWidth;
    const h = rotated ? item.originalWidth : item.originalHeight;

    if (startX + w > 10) return false;
    if (startY + h > 100) return false;

    if (items.length > 0) {
      for (let x = startX; x < startX + w; x++) {
        for (let y = startY; y < startY + h; y++) {
          const overlappingItem = items.find(i => {
            if (i.id === item.id) return false; // Ignore self
            if (i.gridId !== gridId) return false;
            const iw = i.rotated ? i.originalHeight : i.originalWidth;
            const ih = i.rotated ? i.originalWidth : i.originalHeight;
            return x >= i.x && x < i.x + iw && y >= i.y && y < i.y + ih;
          });
          if (overlappingItem) return false;
        }
      }
    }
    return true;
  };

  const handleDragStart = (item, e) => {
    e.preventDefault();
    setDraggedItem(item);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleQuickbarAssign = (item, slotIndex) => {
    setItems(prev => prev.map(i =>
      i.id === item.id ? { ...i, hotbarSlot: slotIndex } : i
    ));
    setDraggedItem(null);
    setHoverState(null);

    if (window.invokeNative) {
      fetch(`https://${GetParentResourceName()}/SetQuickbarSlot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, hotbarSlot: slotIndex })
      }).catch(e => console.error(e));
    }
  };

  const handleQuickbarRemove = (item) => {
    setItems(prev => prev.map(i =>
      i.id === item.id ? { ...i, hotbarSlot: null } : i
    ));
    setDraggedItem(null);
    setHoverState(null);

    if (window.invokeNative) {
      fetch(`https://${GetParentResourceName()}/SetQuickbarSlot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, hotbarSlot: null })
      }).catch(e => console.error(e));
    }
  };

  const handleDrop = () => {
    if (draggedItem) {
      if (hoverState) {
        const targetItem = items.find(i => 
          i.gridId === hoverState.gridId &&
          i.id !== draggedItem.id &&
          hoverState.x >= i.x && hoverState.x < i.x + i.width &&
          hoverState.y >= i.y && hoverState.y < i.y + i.height
        );

        if (targetItem && targetItem.name === draggedItem.name && !targetItem.name.includes('weapon_') && !targetItem.info?.unique) {
          setItems(prev => {
            const filtered = prev.filter(i => i.id !== draggedItem.id);
            return filtered.map(i => i.id === targetItem.id ? { ...i, count: i.count + draggedItem.count } : i);
          });
          if (window.invokeNative) {
            fetch(`https://${GetParentResourceName()}/MergeStack`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ source: draggedItem, target: targetItem })
            });
          }
          setDraggedItem(null);
          setHoverState(null);
          return;
        }

        if (isValidPosition(draggedItem, hoverState.gridId, hoverState.x, hoverState.y, draggedItem.rotated)) {
          const updatedItem = {
            ...draggedItem,
            gridId: hoverState.gridId,
            x: hoverState.x,
            y: hoverState.y,
            rotated: draggedItem.rotated
          };

          setItems(prev => prev.map(i => 
            i.id === draggedItem.id ? updatedItem : i
          ));

          if (window.invokeNative) {
            // Caso 1: Mover dentro del mismo grid personal
            if (draggedItem.gridId === 'personal' && hoverState.gridId === 'personal') {
              fetch(`https://${GetParentResourceName()}/SetItemSlot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  item: updatedItem,
                  x: hoverState.x,
                  y: hoverState.y,
                  rotated: draggedItem.rotated
                })
              });
            }
            // Caso 2: RECOGER del Contenedor Secundario al Inventario Personal
            else if (draggedItem.gridId !== 'personal' && hoverState.gridId === 'personal') {
              fetch(`https://${GetParentResourceName()}/TakeFromSecondary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  containerId: draggedItem.gridId,
                  item: draggedItem,
                  x: hoverState.x,
                  y: hoverState.y,
                  rotated: draggedItem.rotated
                })
              });
            }
            // Caso 3: DEPOSITAR del Inventario Personal al Contenedor Secundario
            else if (draggedItem.gridId === 'personal' && hoverState.gridId !== 'personal') {
              fetch(`https://${GetParentResourceName()}/PutInSecondary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  containerId: hoverState.gridId,
                  item: draggedItem,
                  x: hoverState.x,
                  y: hoverState.y,
                  rotated: draggedItem.rotated
                })
              });
            }
          }
        }
      } else {
        // Soltar fuera tira el objeto (solo si venía del inventario personal)
        if (draggedItem.gridId === 'personal') {
          if (window.invokeNative) {
            fetch(`https://${GetParentResourceName()}/DropItem`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ item: draggedItem, amount: draggedItem.count })
            });
          }
        }
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
    handleQuickbarAssign,
    handleQuickbarRemove,
    isValidPosition
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
