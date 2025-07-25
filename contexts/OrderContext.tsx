import { postOrder } from '@/hooks/data/Order/api';
import { Order } from '@/models/Order';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface OrderContextType {
    order: Order;
    updateOrder: (data: Partial<Order>) => void;
    placeOrder: () => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [order, setOrder] = useState<Order>(new Order());

    const updateOrder = useCallback((data: Partial<Order>) => {
        setOrder((prevOrder) => new Order({ ...prevOrder, ...data }));
    }, []);

    const placeOrder = useCallback(async () => {
        if (order.isValid()) {
            try {
                console.log('Placing order from context:', JSON.stringify(order, null, 2));
                const response = await postOrder(order);
                console.log('Order placed successfully. API Response:', response);
                return true;
            } catch (error) {
                console.error('Failed to place order:', error);
                return false;
            }
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
