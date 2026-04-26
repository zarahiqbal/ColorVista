// context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define types
type FontSize = 'Small' | 'Medium' | 'Large';
type ColorBlindMode = 'None' | 'Protanopia' | 'Deuteranopia' | 'Tritanopia';

interface ThemeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  // Helper to get actual pixel number based on selection
  getFontSizeMultiplier: () => number;
}

// 2. Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Create Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('Medium');
  const [darkMode, setDarkMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('None');

  // Logic to determine scaling
  const getFontSizeMultiplier = () => {
    switch (fontSize) {
      case 'Small': return 0.8;
      case 'Large': return 1.2;
      default: return 1.0; // Medium
    }
  };

  return (
    <ThemeContext.Provider value={{
      fontSize,
      setFontSize,
      darkMode,
      setDarkMode,
      colorBlindMode,
      setColorBlindMode,
      getFontSizeMultiplier
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Custom Hook for easy access
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}