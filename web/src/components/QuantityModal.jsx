import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

export default function QuantityModal({ title, item, maxAmount, isGive, onSubmit, onClose }) {
  const [amount, setAmount] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSubmit = () => {
    const qty = parseInt(amount);
    if (!isNaN(qty) && qty > 0 && qty <= maxAmount) {
      if (isGive) {
        const pId = parseInt(playerId);
        if (!isNaN(pId) && pId > 0) {
          onSubmit(qty, pId);
        } else {
          alert("Debes introducir una ID de jugador destino válida");
        }
      } else {
        onSubmit(qty, null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-6 w-[320px] flex flex-col gap-4 animate-fade-in relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 shadow-md"></div>

        <h3 className="text-white font-black tracking-wider text-center drop-shadow">{title}</h3>
        
        <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-white/10 shadow-inner">
          <img src={item.image} alt={item.label} className="w-12 h-12 object-contain drop-shadow-md" onError={(e) => e.target.style.display='none'} />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white">{item.label}</span>
            <span className="text-xs font-bold text-emerald-400">Máximo: {maxAmount}</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black tracking-widest text-slate-300 uppercase mb-1">Cantidad</label>
          <input
            ref={inputRef}
            type="number"
            min="1"
            max={maxAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-950/90 border border-white/20 rounded-xl p-3 text-white text-center font-mono font-bold text-xl outline-none focus:border-emerald-400 shadow-inner transition-colors"
          />
        </div>

        {isGive && (
          <div>
            <label className="block text-[10px] font-black tracking-widest text-slate-300 uppercase mb-1">ID Jugador Destino</label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 1"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-950/90 border border-white/20 rounded-xl p-3 text-emerald-400 text-center font-mono font-bold text-xl outline-none focus:border-emerald-400 shadow-inner transition-colors"
            />
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 p-3 rounded-xl font-black transition-colors flex items-center justify-center border border-red-500/30 shadow-md"
          >
            CANCELAR
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 p-3 rounded-xl font-black transition-colors flex items-center justify-center border border-emerald-500/40 shadow-md"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
}
