import { Icon } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useShoppingCartContext, useThemeContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { QuantityControl } from './QuantityControl';

interface ShoppingCartItemActionsProps {
    item: ShoppingCartItem;
}

export const ShoppingCartItemActions: React.FC<ShoppingCartItemActionsProps> = ({ item }) => {
    const { themeManager } = useThemeContext();
    const { removeFromCart } = useShoppingCartContext();
    const accentVariant = themeManager.getVariant('accent');
    const product = item.selectedVariant || item.baseProduct;

    const handleRemove = () => removeFromCart(product.id);
    const handlePress = () => router.push(routes.product(item.baseProduct));

    return (
        <XStack justifyContent="space-between" alignItems="center" width="100%">
            <Pressable onPress={handlePress} hitSlop={10}>
                <Icon name="prev" color={accentVariant.text.primary} />
            </Pressable>
            <YStack alignItems="flex-end">
                <XStack alignItems="center">
                    <QuantityControl product={product} baseProduct={item.baseProduct} />
                    <Pressable onPress={handleRemove} style={{ padding: 8, marginLeft: 8 }}>
                        <Icon name="emptyCart" color={accentVariant.text.primary} />
                    </Pressable>
                </XStack>
                <CustomText>Subtotal: {formatPrice(product.price * item.quantity)}</CustomText>
            </YStack>
        </XStack>
    );
};
