import { useOrderContext } from '@/contexts/OrderContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import {
    mockAddress,
    mockSimpleProductData,
    mockVariableProductData,
    mockVariation1Data,
} from '@/lib/debug/mock-data';
import { Address } from '@/models/Order';
import { ProductVariation, SimpleProduct, VariableProduct } from '@/models/Product';
import React from 'react';
import { Button } from 'tamagui';

export const DebugSeeder = () => {
    const { clearCart, increaseQuantity } = useShoppingCartContext();
    const { updateOrder } = useOrderContext();

    const handleSeedData = () => {
        // 1. Clear previous state
        //clearCart();

        // 2. Create product instances from mock data
        const simpleProduct = new SimpleProduct(mockSimpleProductData);
        const variableProduct = new VariableProduct(mockVariableProductData);
        const variation1 = new ProductVariation(mockVariation1Data);

        // 3. Add items to cart
        increaseQuantity({ product: simpleProduct });
        increaseQuantity({ product: variableProduct, productVariation: variation1 });

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
