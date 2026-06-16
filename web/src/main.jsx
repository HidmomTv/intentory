import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { InventoryProvider } from './context/InventoryContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </ThemeProvider>
  </StrictMode>,
)
