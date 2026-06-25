import React, { useEffect, useRef } from 'react';
import { Play, HandHeart, SplitSquareHorizontal, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';

export default function ContextMenu({ x, y, item, invType, onClose, onAction }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isShop = invType === 'shop' || item?.gridId?.startsWith('shop');

  const standardActions = [
    { id: 'use', label: 'Usar Ítem', icon: Play, color: 'hover:bg-emerald-600/50 hover:border-emerald-400' },
    { id: 'give', label: 'Transferir / Dar', icon: HandHeart, color: 'hover:bg-blue-600/50 hover:border-blue-400' },
    { id: 'split', label: 'Dividir Stack', icon: SplitSquareHorizontal, color: 'hover:bg-amber-600/50 hover:border-amber-400' },
    { id: 'drop', label: 'Soltar al Suelo', icon: Trash2, color: 'hover:bg-red-600/50 hover:border-red-400' }
  ];

  const shopActions = [
    { id: 'buy_1', label: `Comprar 1 ($${item?.price || 0})`, icon: ShoppingCart, color: 'hover:bg-emerald-600/60 hover:border-emerald-400' },
    { id: 'buy_5', label: `Comprar 5 ($${(item?.price || 0)*5})`, icon: ShoppingCart, color: 'hover:bg-teal-600/60 hover:border-teal-400' },
    { id: 'buy_10', label: `Comprar 10 ($${(item?.price || 0)*10})`, icon: ShoppingCart, color: 'hover:bg-cyan-600/60 hover:border-cyan-400' },
    { id: 'buy_custom', label: 'Comprar Cantidad...', icon: ShoppingBag, color: 'hover:bg-indigo-600/60 hover:border-indigo-400' }
  ];

  const activeActions = isShop ? shopActions : standardActions;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] w-[190px] flex flex-col overflow-hidden animate-fadeIn select-none p-1.5"
      style={{ left: Math.min(x, window.innerWidth - 200), top: Math.min(y, window.innerHeight - 220) }}
    >
      <div className="px-3 py-2 bg-gradient-to-r from-white/10 to-transparent border-b border-white/10 mb-1 rounded-t-xl">
        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block truncate">
          {item?.label || 'Objeto'}
        </span>
        {isShop && (
          <span className="text-[10px] font-mono text-slate-300 font-bold">Precio unitario: ${item?.price || 0}</span>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        {activeActions.map(action => (
          <button
            key={action.id}
            onClick={() => onAction(action.id, item)}
            className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-black text-white bg-slate-900/90 border border-white/10 rounded-xl transition-all duration-150 text-left shadow-sm ${action.color} group cursor-pointer`}
          >
            <action.icon size={15} className="text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span className="tracking-wide drop-shadow">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
