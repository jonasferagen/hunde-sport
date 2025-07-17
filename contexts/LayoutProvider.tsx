import { usePathname } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface LayoutContextType {
    insets: EdgeInsets;
    bottomMenuHeight: number;
    setBottomMenuHeight: (height: number) => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    sidebarAnimatedStyle: Record<string, unknown>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [bottomMenuHeight, setBottomMenuHeight] = useState(60); // Default height
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const pathname = usePathname();

    const sidebarWidth = width * 0.9;
    const duration = 300;
    const translateX = useSharedValue(-sidebarWidth);
    const opacity = useSharedValue(0);

    const sidebarAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        if (isSidebarVisible) {
            translateX.value = withTiming(0, { duration });
            opacity.value = withTiming(1, { duration });
        } else {
            translateX.value = withTiming(-sidebarWidth, { duration });
            opacity.value = withTiming(0, { duration });
        }
    }, [isSidebarVisible, sidebarWidth]);

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
        <LayoutContext.Provider value={{ insets, bottomMenuHeight, setBottomMenuHeight, isSidebarVisible, toggleSidebar, closeSidebar, sidebarAnimatedStyle }}>
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
