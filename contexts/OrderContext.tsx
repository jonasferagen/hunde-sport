import type { Order } from '@/models/Order';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface OrderContextType {
    order: Order | null;
    updateOrder: (data: Partial<Order>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [order, setOrder] = useState<Order | null>(null);

    const updateOrder = useCallback((data: Partial<Order>) => {
        setOrder((prevOrder) => ({
            ...(prevOrder || {}),
            ...data,
        } as Order));
    }, []);

    const value = useMemo(() => ({ order, updateOrder }), [order, updateOrder]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrderContext must be used within an OrderProvider');
    }
    return context;
};
