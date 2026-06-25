import React, { useState, useEffect } from 'react'
import { X, Settings, User } from 'lucide-react'
import { useTheme } from './ThemeContext'
import Equipment from './components/HumanBody'
import Hotbar from './components/Hotbar'
import Grid from './components/Grid'
import DragOverlay from './components/DragOverlay'
import QuickAccessBar from './components/QuickAccessBar'
import AdminPanel from './components/AdminPanel'

const themeStyles = {
  basic: {
    appBg: "bg-slate-950/70 font-basic bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/80 to-black/90",
    panel: "bg-slate-900/85 backdrop-blur-2xl border border-white/25 shadow-[0_12px_45px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden",
    textPrimary: "text-white font-black tracking-wider drop-shadow-md",
    textSecondary: "text-slate-200 font-bold",
  },
  pipboy: {
    appBg: "bg-[#040804]/80 font-pipboy scanlines backdrop-blur-md",
    panel: "bg-[#0b160b]/90 border border-[var(--primary-color)] shadow-[0_0_20px_var(--primary-glow)_inset] rounded-lg relative overflow-hidden",
    textPrimary: "text-[var(--primary-color)] font-extrabold drop-shadow-[0_0_4px_var(--primary-glow)]",
    textSecondary: "text-[var(--primary-color)] opacity-90 font-bold",
  },
  military: {
    appBg: "bg-[#181c18]/80 font-military backdrop-blur-md",
    panel: "bg-[#222822]/90 border border-[#485448] shadow-2xl rounded-xl relative overflow-hidden",
    textPrimary: "text-[#edf2ed] font-extrabold tracking-wide drop-shadow",
    textSecondary: "text-[#b0c0b0] font-bold",
  },
  urban: {
    appBg: "bg-slate-950/80 font-urban backdrop-blur-md",
    panel: "bg-slate-900/90 border border-[var(--primary-color)]/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden",
    textPrimary: "text-white font-black tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]",
    textSecondary: "text-slate-300 font-bold",
  }
}

function App() {
  const isDev = !window.invokeNative
  const [isVisible, setIsVisible] = useState(isDev)
  const [showLoot, setShowLoot] = useState(isDev)
  const [containerInfo, setContainerInfo] = useState({ title: "Suelo / Loot", maxWeight: 50.0, id: "loot" })
  const [showSettings, setShowSettings] = useState(false)
  const [adminPanelData, setAdminPanelData] = useState(null)
  const { themeName, setThemeName, primaryColor, setPrimaryColor } = useTheme()

  const t = themeStyles[themeName]

  const handleClose = () => {
    setIsVisible(false);
    if (window.invokeNative) {
      fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }).catch(e => console.log('Error closing NUI', e));
    }
  }

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'openInventory') {
        setIsVisible(true)
        setShowLoot(false)
      } else if (event.data.action === 'closeInventory') {
        setIsVisible(false)
        setShowLoot(false)
      } else if (event.data.action === 'openLoot' || event.data.action === 'openContainer') {
        setIsVisible(true)
        setShowLoot(true)
        setContainerInfo({
          title: event.data.title || "Suelo / Loot",
          maxWeight: event.data.maxWeight || 50.0,
          id: event.data.containerId || "loot",
          invType: event.data.invType || "container"
        });
      } else if (event.data.action === 'closeSecondaryDrop') {
        setShowLoot(false);
      } else if (event.data.action === 'openAdminPanel') {
        setAdminPanelData({ players: event.data.players, items: event.data.items });
      }
    };

    const handleKeyDown = (e) => {
      if (['Escape', 'Tab', 'F2', 'i', 'I'].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleClose();
        }
      }
    };

    window.addEventListener('message', handleMessage)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <Hotbar />
      <DragOverlay />
      
      {isVisible && (
        <div className={`flex h-screen w-screen items-center justify-center p-8 transition-colors duration-500 select-none bg-black/20 backdrop-blur-md`}>
          
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
            <div className={`absolute top-20 left-6 z-50 w-80 bg-slate-900/95 border border-white/30 shadow-2xl rounded-2xl p-6 flex flex-col gap-5 animate-fade-in backdrop-blur-2xl`}>
              <h3 className={`font-black text-lg tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2`}>
                ⚙️ MOTOR DE TEMAS V3
              </h3>
              
              <div>
                <label className={`block text-xs font-bold mb-2 tracking-widest uppercase text-slate-300`}>Estilo Visual</label>
                <select 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-white/20 p-3 rounded-xl text-white outline-none focus:border-[var(--primary-color)] cursor-pointer font-bold shadow-inner"
                >
                  <option value="basic">Minimalista Traslúcido (AAA)</option>
                  <option value="pipboy">Retro Terminal PipBoy</option>
                  <option value="military">Táctico Militar Tarkov</option>
                  <option value="urban">Urbano Neón Traslúcido</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-2 tracking-widest uppercase text-slate-300`}>Color de Acento</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full h-11 rounded-xl border border-white/30 flex items-center justify-center font-mono font-black text-sm text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] shadow-lg" style={{ backgroundColor: primaryColor }}>
                      {primaryColor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-full flex justify-center gap-6 max-w-[1300px] z-10 relative">
            
            {/* Left Side: External / Loot / Stash / Trunk / Glovebox / Shop */}
            {showLoot && (
              <div className={`w-[460px] p-4 flex flex-col ${t.panel}`}>
                <Grid id={containerInfo.id} title={containerInfo.title} maxWeight={containerInfo.maxWeight} invType={containerInfo.invType} />
              </div>
            )}

            {/* Center: Character Info & Equipment Slots & Quick Access */}
            <div className={`w-[340px] p-4 flex flex-col items-center justify-between relative ${t.panel}`}>
              <div className="w-full flex flex-col items-center">
                {/* Player Header */}
                <div className="w-full flex items-center gap-4 mb-4 bg-zinc-800/80 p-3.5 rounded-xl border border-white/10 shadow-md">
                  <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shadow-inner">
                    <User size={22} className={t.textSecondary} />
                  </div>
                  <div>
                    <h3 className={`font-black tracking-widest text-base ${t.textPrimary}`}>JUGADOR UNO</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[11px] font-mono font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded border border-green-500/30">$ 5,000</span>
                      <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30">$ 15,000</span>
                    </div>
                  </div>
                </div>

                <h3 className={`text-[10px] font-black w-full text-center uppercase tracking-widest ${t.textSecondary} mb-1`}>
                  EQUIPAMIENTO ANATÓMICO
                </h3>
                
                <Equipment />
              </div>

              {/* Acceso Rápido 1-6 Independiente */}
              <div className="w-full mt-4 pt-3 border-t border-white/10 flex flex-col items-center">
                <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase mb-2 flex items-center gap-1">
                  ⚡ ACCESO RÁPIDO (1 - 6)
                </span>
                <QuickAccessBar />
              </div>
            </div>

            {/* Right Side: Player Inventory */}
            <div className={`w-[460px] p-4 flex flex-col relative ${t.panel}`}>
              <Grid id="personal" title="Inventario" maxWeight="30.0" />
            </div>
          </div>
        </div>
      )}

      {adminPanelData && (
        <AdminPanel 
          players={adminPanelData.players} 
          items={adminPanelData.items} 
          onClose={() => { setAdminPanelData(null); if(window.invokeNative) fetch(`https://${GetParentResourceName()}/close`, { method:'POST', body:'{}' }); }}
        />
      )}
    </>
  )
}

export default App
