import { Order } from '@/models/Order';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface OrderContextType {
    order: Order;
    updateOrder: (data: Partial<Order>) => void;
    placeOrder: () => boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [order, setOrder] = useState<Order>(new Order());

    const updateOrder = useCallback((data: Partial<Order>) => {
        setOrder((prevOrder) => new Order({ ...prevOrder, ...data }));
    }, []);

    const placeOrder = useCallback(() => {
        if (order.isValid()) {
            console.log('Placing order from context:', JSON.stringify(order, null, 2));
            // TODO: Post to API endpoint
            return true;
        } else {
            console.error('Attempted to place an invalid order from context:', order);
            return false;
        }
    }, [order]);

    const value = useMemo(() => ({ order, updateOrder, placeOrder }), [order, updateOrder, placeOrder]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrderContext must be used within an OrderProvider');
    }
    return context;
};
