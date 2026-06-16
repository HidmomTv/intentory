import React, { useState, useEffect } from 'react'
import { X, Settings, User } from 'lucide-react'
import { useTheme } from './ThemeContext'
import Equipment from './components/HumanBody'
import Hotbar from './components/Hotbar'
import Grid from './components/Grid'
import DragOverlay from './components/DragOverlay'

const themeStyles = {
  basic: {
    appBg: "bg-zinc-950 font-basic bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black",
    panel: "bg-black/40 backdrop-blur-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-xl relative overflow-hidden",
    textPrimary: "text-gray-100",
    textSecondary: "text-gray-500",
  },
  pipboy: {
    appBg: "bg-[#050a05] font-pipboy scanlines",
    panel: "bg-[#0a140a]/80 border border-[var(--primary-color)] shadow-[0_0_10px_var(--primary-glow)_inset] rounded-sm relative",
    textPrimary: "text-[var(--primary-color)] drop-shadow-[0_0_2px_var(--primary-glow)]",
    textSecondary: "text-[var(--primary-color)] opacity-60",
  },
  military: {
    appBg: "bg-[#141614] font-military bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1e221e] to-[#0a0b0a]",
    panel: "bg-[#1c201c] border-t-2 border-l-2 border-[#2d332d] border-b-2 border-r-2 border-[#0a0b0a] shadow-2xl rounded-none relative",
    textPrimary: "text-[#d1dcd1]",
    textSecondary: "text-[#7a8c7a]",
  },
  urban: {
    appBg: "bg-zinc-950 font-urban bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-zinc-950",
    panel: "bg-zinc-900 border-2 border-zinc-800 shadow-[6px_6px_0_var(--primary-color)] rounded-none relative",
    textPrimary: "text-white drop-shadow-[2px_2px_0_var(--primary-color)]",
    textSecondary: "text-gray-400",
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

  return (
    <>
      <Hotbar />
      <DragOverlay />
      
      {isVisible && (
        <div className={`flex h-screen w-screen items-center justify-center p-8 transition-colors duration-500 select-none ${t.appBg}`}>
          
          {themeName === 'basic' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary-color)] rounded-full blur-[200px] opacity-[0.07] pointer-events-none"></div>
          )}

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-6 left-6 z-50 bg-black/40 p-3 rounded-full border border-white/10 text-gray-400 hover:text-white hover:rotate-90 transition-all hover:border-[var(--primary-color)] backdrop-blur-md"
          >
            <Settings size={20} />
          </button>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`absolute top-20 left-6 z-50 w-72 ${t.panel} p-5 flex flex-col gap-5 animate-fade-in`}>
              <h3 className={`font-bold text-lg tracking-wider ${t.textPrimary} border-b border-white/5 pb-3`}>MOTOR DE TEMAS V3</h3>
              
              <div>
                <label className={`block text-xs font-bold mb-2 tracking-widest uppercase ${t.textSecondary}`}>Estilo</label>
                <select 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 p-3 rounded-md text-white outline-none focus:border-[var(--primary-color)] cursor-pointer"
                >
                  <option value="basic">Minimalista Oscuro (AAA)</option>
                  <option value="pipboy">Retro Terminal (Fallo)</option>
                  <option value="military">Táctico Hardcore (Tarkov)</option>
                  <option value="urban">Urbano Neón</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-2 tracking-widest uppercase ${t.textSecondary}`}>Color de Acento</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full h-10 rounded-md border border-white/10 flex items-center justify-center font-mono text-xs text-white" style={{ backgroundColor: primaryColor }}>
                      {primaryColor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-full flex gap-6 max-w-[1700px] z-10 relative">
            
            {/* Left Side: External / Loot / Stash */}
            <div className={`flex-1 p-6 flex flex-col ${t.panel}`}>
              <Grid id="loot" title="Suelo / Loot" maxWeight="50.0" />
            </div>

            {/* Center: Character Info & Equipment Slots */}
            <div className={`w-[420px] p-6 flex flex-col items-center relative ${t.panel}`}>
              
              {/* Player Header */}
              <div className="w-full flex items-center gap-4 mb-6 bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="w-14 h-14 rounded-lg bg-black border border-white/10 flex items-center justify-center shadow-lg">
                  <User size={24} className={t.textSecondary} />
                </div>
                <div>
                  <h3 className={`font-bold tracking-widest text-lg ${t.textPrimary}`}>JUGADOR UNO</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">$ 5,000</span>
                    <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">$ 15,000</span>
                  </div>
                </div>
              </div>

              <h3 className={`text-xs font-black w-full text-center uppercase tracking-widest ${t.textSecondary} mb-2`}>
                EQUIPAMIENTO ACTIVO
              </h3>
              
              <Equipment />
              
            </div>

            {/* Right Side: Player Inventory */}
            <div className={`flex-1 p-6 flex flex-col relative ${t.panel}`}>
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 w-8 h-8 bg-black/50 hover:bg-red-500/20 rounded border border-white/10 flex items-center justify-center transition-all hover:border-red-500/50 text-gray-500 hover:text-red-400 z-50"
              >
                <X size={18} />
              </button>

              <Grid id="personal" title="Inventario" maxWeight="30.0" />

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
