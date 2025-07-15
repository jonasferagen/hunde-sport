import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

interface StatusAction {
    label: string;
    onPress: () => void;
}

interface ShowMessageParams {
    text: string;
    type?: 'info' | 'success' | 'error';
    action?: StatusAction;
    duration?: number;
}

interface StatusContextType {
    message: string | null;
    type: 'info' | 'success';
    action: StatusAction | null;
    showMessage: (params: ShowMessageParams) => void;
    hideMessage: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [action, setAction] = useState<StatusAction | null>(null);
    const [type, setType] = useState<'info' | 'success'>('info');

    const hideMessage = useCallback(() => {
        setMessage(null);
        setAction(null);
    }, []);

    const showMessage = useCallback(
        ({ text, type = 'info', action: newAction, duration = 3000 }: ShowMessageParams) => {
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
        <StatusContext.Provider value={{ message, type, action, showMessage, hideMessage }}>
            {children}
        </StatusContext.Provider>
    );
};

export const useStatus = () => {
    const context = useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
};
