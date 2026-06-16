import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('inventory_theme') || 'basic';
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('inventory_color') || '#6366f1';
  });

  useEffect(() => {
    localStorage.setItem('inventory_theme', themeName);
  }, [themeName]);

  useEffect(() => {
    localStorage.setItem('inventory_color', primaryColor);
    // Parse hex to rgba for glow effect
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    // Simple hex to rgba converter for CSS var
    let r = 0, g = 0, b = 0;
    if(primaryColor.length === 7) {
        r = parseInt(primaryColor.substring(1,3), 16);
        g = parseInt(primaryColor.substring(3,5), 16);
        b = parseInt(primaryColor.substring(5,7), 16);
    }
    document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
    
  }, [primaryColor]);

  const value = {
    themeName,
    setThemeName,
    primaryColor,
    setPrimaryColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
