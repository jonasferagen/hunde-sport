import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import { Minus, Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

interface QuantityControlProps {
    product: Product | ProductVariation;
    parentProduct?: Product;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ product, parentProduct }) => {
    const { getQuantity, increaseQuantity, decreaseQuantity } = useShoppingCartContext();

    const quantity = getQuantity(product);

    const handleIncrease = () => increaseQuantity(product, parentProduct);
    const handleDecrease = () => decreaseQuantity(product);

    return (
        <XStack alignItems="center" justifyContent="flex-end" width={100} height="auto">
            <XStack
                animation="quick"
                alignItems="center"
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
