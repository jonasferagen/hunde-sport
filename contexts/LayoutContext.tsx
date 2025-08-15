import React, { createContext, useContext, useState } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface LayoutContextType {
    insets: EdgeInsets;
    layout: { width: number; height: number };
    headerHeight: number;
    setHeaderHeight: (height: number) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const [headerHeight, setHeaderHeight] = useState(0);

    return (
        <LayoutContext.Provider value={{ insets, layout, headerHeight, setHeaderHeight }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};
