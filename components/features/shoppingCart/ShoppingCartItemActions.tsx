import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { ChevronLeft, Trash2 } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import React, { JSX } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';
import { QuantityControl } from './QuantityControl';

interface ShoppingCartItemActionsProps {
    item: ShoppingCartItem;
}

export const ShoppingCartItemActions = ({
    item,
}: ShoppingCartItemActionsProps): JSX.Element => {
    const { removeFromCart } = useShoppingCartContext();
    const product = item.selectedVariant || item.baseProduct;

    const handleRemove = (): void => removeFromCart(product.id);
    const handlePress = (): void => router.push(routes.product(item.baseProduct));

    return (
        <XStack jc="space-between" ai="center" width="100%">
            <Button unstyled onPress={handlePress} hitSlop={10} pressStyle={{ opacity: 0.7 }}>
                <ChevronLeft color="$color" />
            </Button>
            <YStack alignItems="flex-end">
                <XStack alignItems="center">
                    <QuantityControl product={product} baseProduct={item.baseProduct} />
                    <Button
                        unstyled
                        onPress={handleRemove}
                        padding="$2"
                        marginLeft="$2"
                        pressStyle={{ opacity: 0.7 }}
                    >
                        <Trash2 color="$color" />
                    </Button>
                </XStack>
                <SizableText>
                    Subtotal: {formatPrice(product.price * item.quantity)}
                </SizableText>
            </YStack>
        </XStack>
    );
};
