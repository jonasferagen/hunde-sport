import { useOrderContext } from '@/contexts/OrderContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import {
    mockAddress,
    mockSimpleProductData,
    mockVariableProductData,
    mockVariation1Data,
} from '@/lib/debug/mock-data';
import { Address } from '@/models/Order';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import React from 'react';
import { Button } from 'tamagui';

export const DebugSeeder = () => {
    const { clearCart, increaseQuantity } = useShoppingCartContext();
    const { updateOrder } = useOrderContext();

    const handleSeedData = () => {
        // 1. Clear previous state
        //clearCart();

        // 2. Create product instances from mock data
        const simpleProduct = new Product(mockSimpleProductData);
        const variableProduct = new Product(mockVariableProductData);
        const variation1 = new ProductVariation(mockVariation1Data);

        // 3. Add items to cart
        increaseQuantity(simpleProduct);
        increaseQuantity(variableProduct, variation1);

        // 4. Populate billing and shipping info
        const shippingAddress: Address = mockAddress;
        updateOrder({ billing: mockAddress, shipping: shippingAddress });

        console.log('🛒 Mock data loaded into cart and order form.');
    };

    // Render the seeder only in development mode
    if (!__DEV__) {
        return null;
    }

    return (
        <Button onPress={handleSeedData} theme="orange">
            Load Mock Data
        </Button>
    );
};
