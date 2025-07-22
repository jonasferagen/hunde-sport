import { CustomText, Icon } from '@/components/ui';
import { useShoppingCartContext, useThemeContext } from '@/contexts';
import { Product } from '@/models/Product';
import React from 'react';
import { XStack } from 'tamagui';

interface QuantityControlProps {
    product: Product;
    baseProduct?: Product;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ product, baseProduct }) => {
    const { themeManager } = useThemeContext();
    const { getQuantity, increaseQuantity, decreaseQuantity } = useShoppingCartContext();
    const variant = themeManager.getVariant('accent');

    const quantity = getQuantity(product);

    const handleIncrease = () => increaseQuantity(product, baseProduct);
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
                    <Icon name="remove" size="xxl" color={variant.text.secondary} />
                </XStack>
                <CustomText fontSize="$md" fontWeight="600" minWidth={20} textAlign="center">
                    {quantity}
                </CustomText>
            </XStack>

            <XStack onPress={handleIncrease} p="$2" pressStyle={{ opacity: 0.7 }}>
                <Icon name="add" size="xxl" color={variant.text.secondary} />
            </XStack>
        </XStack>
    );
};
