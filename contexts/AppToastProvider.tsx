import { AppToast } from '@/components/ui/AppToast';
import { ToastProvider as TamaguiToastProvider, ToastViewport } from '@tamagui/toast';
import React, { JSX } from 'react';

interface AppToastProviderProps {
    children: React.ReactNode;
}

export const AppToastProvider = ({ children }: AppToastProviderProps): JSX.Element => {
    return (
        <TamaguiToastProvider>
            <AppToast />
            <ToastViewport
                multipleToasts={false}
                b={0}
                l={0}
                pos="absolute"
                h="50"
                w="100%"
            />
            {children}
        </TamaguiToastProvider>
    );
};
