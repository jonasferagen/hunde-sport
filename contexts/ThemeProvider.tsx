import { theme, themeManager, ThemeManager } from '@/styles/Theme';
import { Theme } from '@/types';
import React, { createContext, useContext } from 'react';

type ThemeContextType = {
    theme: Theme;
    themeManager: ThemeManager;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


    return (
        <ThemeContext.Provider value={{ theme, themeManager }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
