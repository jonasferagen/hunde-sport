import React, { createContext, useCallback, useContext, useState, RefObject } from 'react';
import { Alert } from 'react-native';

interface StatusAction {
    label: string;
    onPress: () => void;
}

interface ShowMessageParams {
    text: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    action?: StatusAction;
    duration?: number;
    elementRef?: RefObject<any>;
}

interface StatusContextType {
    message: string | null;
    type: 'info' | 'success' | 'warning';
    action: StatusAction | null;
    elementRef: RefObject<any> | null;
    showMessage: (params: ShowMessageParams) => void;
    hideMessage: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [action, setAction] = useState<StatusAction | null>(null);
    const [type, setType] = useState<'info' | 'success' | 'warning'>('info');
    const [elementRef, setElementRef] = useState<RefObject<any> | null>(null);

    const hideMessage = useCallback(() => {
        setMessage(null);
        setAction(null);
        setElementRef(null);
    }, []);

    const showMessage = useCallback(
        ({ text, type = 'info', action: newAction, duration = 3000, elementRef: newElementRef }: ShowMessageParams) => {
            if (type === 'error') {
                Alert.alert(
                    'Error',
                    text,
                    newAction
                        ? [
                            { text: 'Cancel', style: 'cancel' },
                            { text: newAction.label, onPress: newAction.onPress },
                        ]
                        : [{ text: 'OK' }]
                );
                return;
            }

            setMessage(text);
            setType(type);
            setElementRef(newElementRef || null);
            if (newAction) {
                setAction(newAction);
            } else {
                setAction(null); // Ensure no old action lingers
                setTimeout(() => {
                    hideMessage();
                }, duration);
            }
        },
        [hideMessage]
    );

    return (
        <StatusContext.Provider value={{ message, type, action, elementRef, showMessage, hideMessage }}>
            {children}
        </StatusContext.Provider>
    );
};

export const useStatusContext = () => {
    const context = useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatusContext must be used within a StatusProvider');
    }
    return context;
};
