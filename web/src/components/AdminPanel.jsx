import React, { useState, useMemo } from 'react';

const getResolvedImage = (item) => {
  if (!item) return '';
  if (item.image && (item.image.startsWith('http') || item.image.startsWith('nui://') || item.image.startsWith('data:'))) return item.image;
  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'qb-inventory';
  const iconName = item.image || `${item.name}.png`;
  return `https://${resourceName}/web/dist/assets/icons/${iconName}`;
};

export default function AdminPanel({ players = [], items = [], onClose }) {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items.slice(0, 48);
    const q = searchQuery.toLowerCase();
    return items.filter(i => 
      (i.name && i.name.toLowerCase().includes(q)) || 
      (i.label && i.label.toLowerCase().includes(q))
    ).slice(0, 48);
  }, [items, searchQuery]);

  const handleDispatch = () => {
    if (!selectedPlayer || !selectedItem) return;
    const resName = window.GetParentResourceName ? window.GetParentResourceName() : 'qb-inventory';
    if (window.invokeNative) {
      fetch(`https://${resName}/AdminGiveItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: selectedPlayer,
          itemName: selectedItem.name,
          amount: Number(amount) || 1
        })
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fadeIn select-none">
      <div className="w-full max-w-4xl h-[85vh] bg-slate-900/90 border border-emerald-500/40 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden relative">
        
        {/* Encabezado Neón */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-emerald-500/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">👑</span>
            <div>
              <h1 className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
                QBCore Admin <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">DESPACHADOR</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Panel visual de entrega transaccional de ítems</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-lg transition-all hover:scale-105"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo principal */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Columna Izquierda: Configuración de entrega */}
          <div className="w-80 p-6 border-r border-white/10 flex flex-col justify-between bg-black/20">
            <div className="space-y-6">
              
              {/* Selector de Jugador */}
              <div>
                <label className="block text-xs font-black text-emerald-400 tracking-wider uppercase mb-2">
                  1. Seleccionar Destinatario
                </label>
                <select 
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full bg-slate-800/90 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white font-bold outline-none focus:border-emerald-400 shadow-inner"
                >
                  <option value="" disabled>Elige un jugador...</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name} [ID: {p.id}]</option>
                  ))}
                </select>
              </div>

              {/* Ítem Seleccionado Preview */}
              <div>
                <label className="block text-xs font-black text-emerald-400 tracking-wider uppercase mb-2">
                  2. Objeto Seleccionado
                </label>
                <div className="w-full h-40 rounded-2xl bg-slate-950/80 border-2 border-dashed border-white/15 flex flex-col items-center justify-center relative overflow-hidden group p-4">
                  {selectedItem ? (
                    <>
                      <img 
                        src={getResolvedImage(selectedItem)}
                        alt={selectedItem.label}
                        onError={(e) => { 
                          if (!e.target.dataset.tried) {
                            e.target.dataset.tried = "true";
                            const resName = window.GetParentResourceName ? window.GetParentResourceName() : 'qb-inventory';
                            e.target.src = `https://${resName}/web/dist/assets/icons/${selectedItem.name}.png`;
                          }
                        }}
                        className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2 animate-bounce-short"
                      />
                      <span className="text-sm font-black text-white tracking-wide text-center">{selectedItem.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedItem.name} • {(selectedItem.weight/1000).toFixed(2)}kg</span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold text-center">Haz clic en un objeto de la lista derecha</span>
                  )}
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div>
                <label className="block text-xs font-black text-emerald-400 tracking-wider uppercase mb-2">
                  3. Cantidad a Entregar
                </label>
                <input 
                  type="number"
                  min="1"
                  max="9999"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800/90 border border-white/20 rounded-xl px-3 py-2 text-lg font-black text-white text-center outline-none focus:border-emerald-400 mb-3"
                />
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 10, 64, 100].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className="bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-lg py-1 text-xs font-bold transition-colors"
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Botón Despachar */}
            <button 
              onClick={handleDispatch}
              disabled={!selectedPlayer || !selectedItem}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${selectedPlayer && selectedItem ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer' : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'}`}
            >
              <span>🚀 DESPACHAR AHORA</span>
            </button>

          </div>

          {/* Columna Derecha: Buscador y Rejilla de Objetos */}
          <div className="flex-1 p-6 flex flex-col bg-slate-950/40">
            
            {/* Buscador */}
            <div className="mb-4">
              <input 
                type="text"
                placeholder="🔍 Buscar objeto por nombre o etiqueta (ej: pistola, agua, metal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder-slate-500 outline-none focus:border-emerald-500/60 shadow-inner transition-colors"
              />
            </div>

            {/* Rejilla de resultados */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-6 gap-2 align-start content-start">
              {filteredItems.map((item, idx) => {
                const isSelected = selectedItem?.name === item.name;
                return (
                  <div 
                    key={item.name + idx}
                    onClick={() => setSelectedItem(item)}
                    className={`aspect-square rounded-xl p-2 cursor-pointer border flex flex-col items-center justify-center relative transition-all duration-150 group overflow-hidden ${isSelected ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' : 'bg-slate-900/80 border-white/10 hover:border-white/30 hover:bg-slate-800/80'}`}
                  >
                    <img 
                      src={getResolvedImage(item)}
                      alt={item.label}
                      onError={(e) => { 
                        if (!e.target.dataset.tried) {
                          e.target.dataset.tried = "true";
                          const resName = window.GetParentResourceName ? window.GetParentResourceName() : 'qb-inventory';
                          e.target.src = `https://${resName}/web/dist/assets/icons/${item.name}.png`;
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                      className="w-10 h-10 object-contain mb-1 drop-shadow transition-transform group-hover:scale-110"
                    />
                    <span className="text-[10px] font-bold text-white text-center leading-tight truncate w-full">{item.label}</span>
                    <span className="text-[8px] text-slate-500 font-mono mt-0.5">{item.name}</span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
