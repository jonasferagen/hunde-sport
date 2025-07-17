import { _theme, theme } from '@/styles/Theme';
import { _Theme, Theme } from '@/types';
import React, { createContext, useContext } from 'react';

type ThemeContextType = {
    theme: Theme;
    _theme: _Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


    return (
        <ThemeContext.Provider value={{ theme, _theme }}>
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
