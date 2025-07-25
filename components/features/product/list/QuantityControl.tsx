import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import type { Product } from '@/models/Product';
import type { ProductVariation } from '@/models/ProductVariation';
import { Minus, Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

interface QuantityControlProps {
    product: Product;
    productVariation?: ProductVariation;
}

export const QuantityControl = ({ product, productVariation }: QuantityControlProps) => {
    const { increaseQuantity, decreaseQuantity, getQuantity } = useShoppingCartContext();

    const quantity = getQuantity(product, productVariation);

    const handleIncrease = () => increaseQuantity(product, productVariation);
    const handleDecrease = () => decreaseQuantity(product, productVariation);

    return (
        <XStack flex={1} jc="flex-end" ai="center" width={100} height="auto">
            <XStack
                animation="quick"
                ai="center"
                opacity={quantity > 0 ? 1 : 0}
                transform={[{ translateX: quantity > 0 ? 0 : 20 }]}
                pointerEvents={quantity > 0 ? 'auto' : 'none'}
            >
                <XStack onPress={handleDecrease} p="$2" pressStyle={{ opacity: 0.7 }}>
                    <Minus size={28} color="$color10" />
                </XStack>
                <SizableText fontSize="$3" fontWeight="600" minWidth={20} textAlign="center">
                    {quantity}
                </SizableText>
            </XStack>

            <XStack onPress={handleIncrease} p="$2" pressStyle={{ opacity: 0.7 }}>
                <Plus size={28} color="$color10" />
            </XStack>
        </XStack>
    );
};
