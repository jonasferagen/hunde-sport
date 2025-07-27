import { Toast } from '@tamagui/toast';
import React, { createContext, ReactNode, useContext } from 'react';
interface ToastContextProps {
    // Will be populated later
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ToastContext.Provider value={{}}>
            <Toast
                animation="quick"
                enterStyle={{ x: -20, opacity: 0 }}
                exitStyle={{ x: -20, opacity: 0 }}
                opacity={1}
                x={0}
                background="blue"
            >
                <Toast.Title>Subscribed!</Toast.Title>
                <Toast.Description>We'll be in touch.</Toast.Description>
            </Toast>

            {children}

        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
