import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useQueryClient } from '@tanstack/react-query';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { categoriesQueryOptions } from '../Category/queries';

interface PreloaderContextType {
    appIsReady: boolean;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export const PreloaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appIsReady, setAppIsReady] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        async function prepare() {
            try {
                // Prefetch root categories
                await queryClient.prefetchInfiniteQuery(categoriesQueryOptions(0));

                await Font.loadAsync({
                    Montserrat_400Regular,
                    Montserrat_700Bold,
                });

            } catch (e) {
                console.warn(e);
            } finally {
                await SplashScreen.hideAsync();
                setAppIsReady(true);
            }
        }

        prepare();
    }, [queryClient]);

    return (
        <PreloaderContext.Provider value={{ appIsReady }}>
            {children}
        </PreloaderContext.Provider>
    );
};

export const usePreloader = () => {
    const context = useContext(PreloaderContext);
    if (context === undefined) {
        throw new Error('usePreloader must be used within a PreloaderProvider');
    }
    return context;
};
