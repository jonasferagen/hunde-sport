import { PurchasableProduct } from '@/models/Product/Product';
import React, { createContext, JSX, useContext, useState } from 'react';

interface DebugContextType {
    product: PurchasableProduct | null;
    setProduct: (product: PurchasableProduct | null) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
    const context = useContext(DebugContext);
    if (!context) {
        throw new Error('useDebug must be used within a DebugProvider');
    }
    return context;
};

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
    const [product, setProduct] = useState<PurchasableProduct | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const value = {
        product,
        setProduct,
        isOpen,
        setIsOpen,
    };

    return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>;
};
