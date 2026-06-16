import React, { useState, useEffect } from 'react'
import { X, Settings } from 'lucide-react'
import { useTheme } from './ThemeContext'
import HumanBody from './components/HumanBody'
import Hotbar from './components/Hotbar'

const themeStyles = {
  basic: {
    appBg: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black/40 backdrop-blur-sm font-basic",
    panel: "bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    gridContainer: "bg-black/20 border border-black/50 rounded-xl shadow-inner",
    slotBg: "bg-zinc-800/30 border border-zinc-700/30 hover:bg-zinc-700/50 rounded-[2px]"
  },
  pipboy: {
    appBg: "bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] bg-[#0f1c0f] font-pipboy scanlines",
    panel: "bg-[#0a140a]/95 border-2 border-[var(--primary-color)] shadow-[0_0_20px_var(--primary-glow)] rounded-sm",
    textPrimary: "text-[var(--primary-color)] drop-shadow-[0_0_4px_var(--primary-glow)]",
    textSecondary: "text-[var(--primary-color)] opacity-70",
    gridContainer: "bg-[#050a05] border border-[var(--primary-color)] rounded-sm",
    slotBg: "bg-transparent border border-[var(--primary-color)]/30 hover:bg-[var(--primary-color)]/20"
  },
  military: {
    appBg: "bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-[#1c221c] font-military",
    panel: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-[#2d332d] border-[3px] border-[#1e221e] shadow-2xl rounded-none relative before:content-[''] before:absolute before:top-1 before:left-1 before:right-1 before:bottom-1 before:border before:border-[#4a544a] before:pointer-events-none",
    textPrimary: "text-[#e8eee8]",
    textSecondary: "text-[#a3b3a3]",
    gridContainer: "bg-[#252a25] border-2 border-[#1e221e] shadow-inner",
    slotBg: "bg-[#2d332d] border border-[#1e221e] hover:bg-[#3d453d]"
  },
  urban: {
    appBg: "bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] bg-zinc-950 font-urban",
    panel: "bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] bg-zinc-900 border-4 border-[var(--primary-color)] shadow-[10px_10px_0_var(--primary-color)] rounded-xl",
    textPrimary: "text-white drop-shadow-[2px_2px_0_#000]",
    textSecondary: "text-gray-300",
    gridContainer: "bg-black border-2 border-zinc-800 rounded-lg",
    slotBg: "bg-zinc-900 border border-zinc-800 hover:bg-[var(--primary-color)]/20"
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

  return (
    <>
      {/* HUD components outside the inventory layout */}
      <Hotbar />

      {/* Main Inventory Component */}
      {isVisible && (
        <div className={`flex h-screen w-screen items-center justify-center p-12 transition-colors duration-500 ${t.appBg}`}>
          
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
            <div className={`absolute top-20 left-6 z-50 w-64 ${t.panel} p-4 flex flex-col gap-4`}>
              <h3 className={`font-bold ${t.textPrimary} border-b border-white/10 pb-2`}>PERSONALIZACIÓN V2</h3>
              
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
                <div className={`bg-black/60 px-3 py-1 rounded-md border border-[var(--primary-color)]`}>
                  <span className={`text-sm font-medium ${t.textPrimary}`}>0.0 <span className="opacity-50">/</span> 50.0 kg</span>
                </div>
              </div>
              
              <div className={`flex-1 grid grid-cols-10 grid-rows-10 gap-[2px] p-2 ${t.gridContainer}`}>
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={`ext-${i}`} className={`transition-colors ${t.slotBg}`}></div>
                ))}
              </div>
            </div>

            {/* Center: Character Info & Interactive Body */}
            <div className="w-[350px] flex flex-col gap-6">
              
              {/* V2: Interactive Human Body Section */}
              <div className={`flex-1 p-6 flex flex-col items-center relative overflow-hidden ${t.panel}`}>
                <h3 className={`text-sm font-bold w-full text-center uppercase tracking-widest ${t.textSecondary} mb-4`}>
                  Equipamiento
                </h3>
                
                {/* Embedded Interactive SVG */}
                <div className="flex-1 w-full relative border border-white/5 rounded-xl bg-black/20 p-4">
                   <HumanBody />
                </div>
              </div>

            </div>

            {/* Right Side: Player Inventory */}
            <div className={`flex-1 p-6 flex flex-col relative ${t.panel}`}>
              <button 
                onClick={() => setIsVisible(false)}
                className={`absolute top-6 right-6 w-8 h-8 bg-black/60 hover:bg-red-500/80 rounded-full border border-white/20 flex items-center justify-center transition-all hover:scale-110 ${t.textSecondary} hover:text-white z-50`}
              >
                <X size={16} />
              </button>

              <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                <div>
                  <h2 className={`text-2xl font-bold tracking-widest ${t.textPrimary}`}>INVENTARIO</h2>
                  <p className={`text-xs mt-1 ${t.textSecondary}`}>Personal</p>
                </div>
                <div className={`bg-black/60 px-3 py-1 mr-12 rounded-md border border-[var(--primary-color)]`}>
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
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>
                  <span className={`text-sm font-bold tracking-wider drop-shadow-md z-10 ${themeName === 'urban' ? 'text-black' : 'text-white'}`}>RIFLE</span>
                  <div className="mt-1 bg-black/80 px-2 py-0.5 rounded-sm border border-white/20 z-10">
                    <span className="text-[10px] text-green-400 font-mono">100%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
