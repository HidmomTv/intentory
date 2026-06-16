import React, { useState, useEffect } from 'react'
import { X, User, Backpack, Shirt, Glasses, Footprints, Settings, Palette } from 'lucide-react'
import { useTheme } from './ThemeContext'

const themeStyles = {
  basic: {
    appBg: "bg-black/40 backdrop-blur-sm font-basic",
    panel: "bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    gridContainer: "bg-black/20 border border-black/50 rounded-xl shadow-inner",
    slotBg: "bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-700/50 rounded-[2px]",
    button: "bg-zinc-800/50 border border-white/5 hover:border-[var(--primary-color)] hover:shadow-[0_0_15px_var(--primary-glow)] rounded-xl"
  },
  pipboy: {
    appBg: "bg-[#0f1c0f] font-pipboy scanlines text-[#1bf222]",
    panel: "bg-[#0a140a]/90 border-2 border-[var(--primary-color)] shadow-[0_0_15px_var(--primary-glow)] rounded-sm",
    textPrimary: "text-[var(--primary-color)] drop-shadow-[0_0_2px_var(--primary-glow)]",
    textSecondary: "text-[var(--primary-color)] opacity-70",
    gridContainer: "bg-[#050a05] border border-[var(--primary-color)] rounded-sm",
    slotBg: "bg-transparent border border-[var(--primary-color)]/30 hover:bg-[var(--primary-color)]/20",
    button: "bg-transparent border border-[var(--primary-color)]/50 hover:bg-[var(--primary-color)]/20 rounded-sm"
  },
  military: {
    appBg: "bg-[#1c221c] font-military text-[#e8eee8] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
    panel: "bg-[#2d332d]/95 border-[3px] border-[#1e221e] shadow-2xl rounded-none relative before:content-[''] before:absolute before:top-1 before:left-1 before:right-1 before:bottom-1 before:border before:border-[#4a544a] before:pointer-events-none",
    textPrimary: "text-[#e8eee8]",
    textSecondary: "text-[#a3b3a3]",
    gridContainer: "bg-[#252a25] border-2 border-[#1e221e] shadow-inner",
    slotBg: "bg-[#2d332d] border border-[#1e221e] hover:bg-[#3d453d]",
    button: "bg-[#343a34] border border-[#1e221e] hover:bg-[#4a544a] rounded-sm"
  },
  urban: {
    appBg: "bg-zinc-950 font-urban text-white",
    panel: "bg-zinc-900 border-4 border-[var(--primary-color)] shadow-[8px_8px_0_var(--primary-color)] rounded-xl",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    gridContainer: "bg-black border-2 border-zinc-800 rounded-lg",
    slotBg: "bg-zinc-900 border border-zinc-800 hover:bg-[var(--primary-color)]/20",
    button: "bg-zinc-900 border-2 border-zinc-700 hover:border-[var(--primary-color)] hover:-translate-y-1 transition-transform rounded-xl"
  }
}

function App() {
  const isDev = !window.invokeNative
  const [isVisible, setIsVisible] = useState(isDev)
  const [showSettings, setShowSettings] = useState(false)
  const { themeName, setThemeName, primaryColor, setPrimaryColor } = useTheme()

  const t = themeStyles[themeName]

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
    <div className={`flex h-screen w-screen items-center justify-center p-12 transition-colors duration-500 ${t.appBg}`}>
      
      {/* Decorative ambient background glow for basic theme */}
      {themeName === 'basic' && (
        <>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--primary-color)] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        </>
      )}

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-6 left-6 z-50 bg-black/60 p-3 rounded-full border border-white/20 text-white hover:rotate-90 transition-all hover:border-[var(--primary-color)]"
      >
        <Settings size={24} />
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-20 left-6 z-50 w-64 ${t.panel} p-4 flex flex-col gap-4 animate-fade-in`}>
          <h3 className={`font-bold ${t.textPrimary} border-b border-white/10 pb-2`}>PERSONALIZACIÓN</h3>
          
          <div>
            <label className={`block text-xs mb-2 ${t.textSecondary}`}>ESTILO (TEMA)</label>
            <select 
              value={themeName} 
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-2 rounded text-white outline-none focus:border-[var(--primary-color)]"
            >
              <option value="basic">Básico Premium</option>
              <option value="pipboy">Terminal Retro</option>
              <option value="military">Táctico Militar</option>
              <option value="urban">Arte Urbano</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs mb-2 ${t.textSecondary}`}>COLOR PRINCIPAL</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-8 cursor-pointer rounded bg-transparent border-0 p-0"
              />
              <div 
                className="w-8 h-8 rounded border border-white/20" 
                style={{ backgroundColor: primaryColor }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full flex gap-8 max-w-[1600px] z-10 relative">
        
        {/* Left Side: External / Loot / Stash */}
        <div className={`flex-1 p-6 flex flex-col ${t.panel}`}>
          <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className={`text-2xl font-bold tracking-widest ${t.textPrimary}`}>SUELO / LOOT</h2>
              <p className={`text-xs mt-1 ${t.textSecondary}`}>Loot temporal</p>
            </div>
            <div className={`bg-black/40 px-3 py-1 rounded-md border border-[var(--primary-color)]`}>
              <span className={`text-sm font-medium ${t.textPrimary}`}>0.0 <span className="opacity-50">/</span> 50.0 kg</span>
            </div>
          </div>
          
          <div className={`flex-1 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 ${t.gridContainer}`}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={`ext-${i}`} className={`transition-colors ${t.slotBg}`}></div>
            ))}
          </div>
        </div>

        {/* Center: Character Info */}
        <div className="w-[300px] flex flex-col gap-6">
          <div className={`p-6 flex flex-col items-center gap-6 relative overflow-hidden ${t.panel}`}>
            {themeName === 'basic' && (
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--primary-color)]/20 to-transparent pointer-events-none"></div>
            )}
            
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-zinc-950/80 border-[3px] border-[var(--primary-color)] flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
                <User size={48} className={t.textPrimary} style={{ color: themeName !== 'basic' ? 'var(--primary-color)' : undefined }} />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-center w-full">
              <h3 className={`font-bold text-xl tracking-wide mb-4 ${t.textPrimary}`}>Jugador 1</h3>
              <div className="flex flex-col gap-2 w-full">
                <div className="bg-black/40 flex justify-between items-center px-4 py-2 rounded-lg border border-green-500/30">
                  <span className={`text-xs ${t.textSecondary}`}>Efectivo</span>
                  <span className="text-sm text-green-400 font-mono font-medium">$ 5,000</span>
                </div>
                <div className="bg-black/40 flex justify-between items-center px-4 py-2 rounded-lg border border-blue-500/30">
                  <span className={`text-xs ${t.textSecondary}`}>Banco</span>
                  <span className="text-sm text-blue-400 font-mono font-medium">$ 15,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex-1 p-6 ${t.panel}`}>
            <h3 className={`text-sm font-bold mb-4 uppercase tracking-widest flex items-center gap-2 ${t.textSecondary}`}>
              <Shirt size={16} /> Vestimenta
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className={`p-3 text-xs font-medium transition-all flex flex-col items-center gap-2 ${t.button} ${t.textPrimary}`}>
                <Glasses size={20} className="opacity-70" />
                Máscara
              </button>
              <button className={`p-3 text-xs font-medium transition-all flex flex-col items-center gap-2 ${t.button} ${t.textPrimary}`}>
                <User size={20} className="opacity-70" />
                Sombrero
              </button>
              <button className={`p-3 text-xs font-medium transition-all flex flex-col items-center gap-2 ${t.button} ${t.textPrimary}`}>
                <Shirt size={20} className="opacity-70" />
                Chaqueta
              </button>
              <button className={`p-3 text-xs font-medium transition-all flex flex-col items-center gap-2 ${t.button} ${t.textPrimary}`}>
                <Footprints size={20} className="opacity-70" />
                Zapatos
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Player Inventory */}
        <div className={`flex-1 p-6 flex flex-col relative ${t.panel}`}>
          <button 
            onClick={() => setIsVisible(false)}
            className={`absolute top-6 right-6 w-8 h-8 bg-black/40 hover:bg-red-500/80 rounded-full border border-white/10 flex items-center justify-center transition-all hover:scale-110 ${t.textSecondary} hover:text-white z-50`}
          >
            <X size={16} />
          </button>

          <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className={`text-2xl font-bold tracking-widest ${t.textPrimary}`}>INVENTARIO</h2>
              <p className={`text-xs mt-1 ${t.textSecondary}`}>Personal</p>
            </div>
            <div className={`bg-black/40 px-3 py-1 mr-12 rounded-md border border-[var(--primary-color)]`}>
              <span className={`text-sm font-medium ${t.textPrimary}`}>12.5 <span className="opacity-50">/</span> 30.0 kg</span>
            </div>
          </div>

          <div className={`flex-1 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 relative ${t.gridContainer}`}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={`inv-${i}`} className={`relative transition-colors ${t.slotBg}`}></div>
            ))}
            
            {/* Premium Mock Item (2x2) */}
            <div 
                className="absolute top-2 left-2 w-[calc(20%-0.15rem)] h-[calc(20%-0.15rem)] border border-white/30 rounded flex flex-col items-center justify-center cursor-pointer transition-all z-10 overflow-hidden group shadow-[0_0_15px_var(--primary-glow)]"
                style={{ backgroundColor: 'var(--primary-color)' }}
            >
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
               <span className="text-sm font-bold tracking-wider text-white drop-shadow-md z-10">RIFLE</span>
               <div className="mt-1 bg-black/60 px-2 py-0.5 rounded-sm border border-white/10 z-10">
                 <span className="text-[10px] text-green-400 font-mono">100%</span>
               </div>
            </div>

            {/* Premium Mock Item (1x1) */}
            <div className="absolute top-2 left-[calc(20%+0.35rem)] w-[calc(10%-0.15rem)] h-[calc(10%-0.15rem)] bg-gradient-to-br from-emerald-500/80 to-teal-600/80 border border-emerald-300/50 rounded flex flex-col items-center justify-center cursor-pointer transition-all z-10 group">
               <span className="text-[10px] font-bold tracking-wider text-white drop-shadow-md">AGUA</span>
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
                    <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--primary-color)' }}>{i+1}</span>
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
