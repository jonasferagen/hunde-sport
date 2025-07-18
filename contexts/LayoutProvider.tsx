import React, { createContext, useContext, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface LayoutContextType {
    insets: EdgeInsets;
    layout: { width: number; height: number };
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const insets = useSafeAreaInsets();
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        if (layout.width !== width || layout.height !== height) {
            setLayout({ width, height });
        }
    };

    return (
        <View style={{ flex: 1 }} onLayout={handleLayout}>
            <LayoutContext.Provider value={{ insets, layout }}>
                {children}
            </LayoutContext.Provider>
        </View>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
