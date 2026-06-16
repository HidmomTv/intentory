import React, { useState, useEffect } from 'react'
import { X, User, Backpack, Shirt, Glasses, Footprints } from 'lucide-react'

function App() {
  const isDev = !window.invokeNative
  const [isVisible, setIsVisible] = useState(isDev)

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'openInventory') setIsVisible(true)
      else if (event.data.action === 'closeInventory') setIsVisible(false)
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
        fetch(`https://${window.GetParentResourceName()}/close`, {
          method: 'POST', body: JSON.stringify({})
        }).catch(() => console.log('Mock NUI Close'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black/40 font-sans text-white p-12 backdrop-blur-sm">
      
      {/* Decorative ambient background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full h-full flex gap-8 max-w-[1600px] z-10 relative">
        
        {/* Left Side: External / Loot / Stash */}
        <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">SUELO</h2>
              <p className="text-xs text-gray-500 mt-1">Loot temporal</p>
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-md border border-white/5">
              <span className="text-sm font-medium text-gray-300">0.0 <span className="text-gray-600">/</span> 50.0 kg</span>
            </div>
          </div>
          
          <div className="flex-1 bg-black/20 rounded-xl border border-black/50 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 shadow-inner">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={`ext-${i}`} className="bg-zinc-800/30 rounded-[2px] border border-zinc-700/30 hover:bg-zinc-700/50 transition-colors"></div>
            ))}
          </div>
        </div>

        {/* Center: Character Info */}
        <div className="w-[300px] flex flex-col gap-6">
          <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6 relative overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
            
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-zinc-950/80 border-[3px] border-indigo-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <User size={48} className="text-indigo-200" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-center w-full">
              <h3 className="font-bold text-xl tracking-wide text-white mb-4">Mariano</h3>
              <div className="flex flex-col gap-2 w-full">
                <div className="bg-black/40 flex justify-between items-center px-4 py-2 rounded-lg border border-green-500/20">
                  <span className="text-xs text-gray-400">Efectivo</span>
                  <span className="text-sm text-green-400 font-mono font-medium">$ 5,000</span>
                </div>
                <div className="bg-black/40 flex justify-between items-center px-4 py-2 rounded-lg border border-blue-500/20">
                  <span className="text-xs text-gray-400">Banco</span>
                  <span className="text-sm text-blue-400 font-mono font-medium">$ 15,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Shirt size={16} /> Vestimenta
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-zinc-800/50 hover:bg-indigo-600/40 border border-white/5 hover:border-indigo-500/50 p-3 rounded-xl text-xs font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center gap-2">
                <Glasses size={20} className="text-gray-400" />
                Máscara
              </button>
              <button className="bg-zinc-800/50 hover:bg-indigo-600/40 border border-white/5 hover:border-indigo-500/50 p-3 rounded-xl text-xs font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center gap-2">
                <User size={20} className="text-gray-400" />
                Sombrero
              </button>
              <button className="bg-zinc-800/50 hover:bg-indigo-600/40 border border-white/5 hover:border-indigo-500/50 p-3 rounded-xl text-xs font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center gap-2">
                <Shirt size={20} className="text-gray-400" />
                Chaqueta
              </button>
              <button className="bg-zinc-800/50 hover:bg-indigo-600/40 border border-white/5 hover:border-indigo-500/50 p-3 rounded-xl text-xs font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center gap-2">
                <Footprints size={20} className="text-gray-400" />
                Zapatos
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Player Inventory */}
        <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 w-8 h-8 bg-black/40 hover:bg-red-500/80 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110"
          >
            <X size={16} />
          </button>

          <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">INVENTARIO</h2>
              <p className="text-xs text-gray-500 mt-1">Personal</p>
            </div>
            <div className="bg-black/40 px-3 py-1 mr-12 rounded-md border border-indigo-500/30">
              <span className="text-sm font-medium text-indigo-300">12.5 <span className="text-gray-600">/</span> 30.0 kg</span>
            </div>
          </div>

          <div className="flex-1 bg-black/20 rounded-xl border border-black/50 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 relative shadow-inner">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={`inv-${i}`} className="bg-zinc-800/30 rounded-[2px] border border-zinc-700/30 hover:bg-zinc-700/50 transition-colors relative"></div>
            ))}
            
            {/* Premium Mock Item (2x2) */}
            <div className="absolute top-2 left-2 w-[calc(20%-0.15rem)] h-[calc(20%-0.15rem)] bg-gradient-to-br from-indigo-500/80 to-purple-600/80 border border-indigo-300/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all z-10 overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-sm font-bold tracking-wider drop-shadow-md">RIFLE</span>
               <div className="mt-1 bg-black/40 px-2 py-0.5 rounded-sm border border-white/10">
                 <span className="text-[10px] text-green-400 font-mono">100%</span>
               </div>
            </div>

            {/* Premium Mock Item (1x1) */}
            <div className="absolute top-2 left-[calc(20%+0.35rem)] w-[calc(10%-0.15rem)] h-[calc(10%-0.15rem)] bg-gradient-to-br from-emerald-500/80 to-teal-600/80 border border-emerald-300/50 rounded-md flex flex-col items-center justify-center cursor-pointer hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all z-10 group">
               <span className="text-[10px] font-bold tracking-wider drop-shadow-md">AGUA</span>
               <span className="text-[9px] text-white/80">x2</span>
            </div>
          </div>

          {/* Quick Hotbar */}
          <div className="mt-6 h-20 bg-black/40 rounded-xl border border-white/10 flex gap-2 p-2 relative shadow-lg">
             <div className="absolute -top-3 left-4 bg-zinc-900 px-2 border border-white/10 rounded text-[10px] text-gray-400 font-bold tracking-widest uppercase">
               Accesos Rápidos
             </div>
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={`hotbar-${i}`} className="flex-1 bg-zinc-800/40 rounded-lg border border-white/5 flex flex-col items-center justify-center relative hover:bg-zinc-700/40 transition-colors cursor-pointer group">
                 <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded flex items-center justify-center border border-white/10">
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">{i+1}</span>
                 </div>
               </div>
             ))}
          </div>

        </div>

      </div>
    </div>
  )
}

export default App
