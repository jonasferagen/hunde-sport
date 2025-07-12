import React, { createContext, useCallback, useContext, useState } from 'react';

interface StatusContextType {
    message: string | null;
    showMessage: (msg: string, duration?: number) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);

    const showMessage = useCallback((msg: string, duration: number = 3000) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage(null);
        }, duration);
    }, []);

    return (
        <StatusContext.Provider value={{ message, showMessage }}>
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
