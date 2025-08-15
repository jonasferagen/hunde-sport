import { AppToast } from '@/components/ui/AppToast';
// AppToastProvider.tsx
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import React from 'react';


export const AppToastProvider = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider native={true} duration={3000} swipeDirection="horizontal">
        <AppToast />
        <ToastViewport multipleToasts={false} top="$4" left={0} />
        {children}
    </ToastProvider>
);


