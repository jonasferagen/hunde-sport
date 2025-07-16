import { usePathname } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface LayoutContextType {
    insets: EdgeInsets;
    bottomMenuHeight: number;
    setBottomMenuHeight: (height: number) => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const [bottomMenuHeight, setBottomMenuHeight] = useState(60); // Default height
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const pathname = usePathname();


    useEffect(() => {
        setSidebarVisible(false);
    }, [pathname]);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const closeSidebar = () => {
        setSidebarVisible(false);
    };


    return (
        <LayoutContext.Provider value={{ insets, bottomMenuHeight, setBottomMenuHeight, isSidebarVisible, toggleSidebar, closeSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
