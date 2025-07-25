import { QuantityControl } from '@/components/features/product/list/QuantityControl';
import { useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Trash2 } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartItemActionsProps {
    item: ShoppingCartItem;
}

export const ShoppingCartItemActions = ({
    item,
}: ShoppingCartItemActionsProps): JSX.Element => {
    const { removeFromCart } = useShoppingCartContext();

    const activeProduct = item.productVariation || item.product;

    const handleRemove = () => {
        removeFromCart(item.product, item.productVariation);
    };


    return (
        <XStack ai="center" jc="space-between" width="100%">

            <YStack ai="flex-end">
                <XStack ai="center">
                    <QuantityControl product={item.product} productVariation={item.productVariation} />
                    <Button icon={<Trash2 size="$1" />} onPress={handleRemove} size="$2" variant="outlined" circular />
                </XStack>
                <SizableText>
                    Subtotal: {formatPrice(activeProduct.price * item.quantity)}
                </SizableText>
            </YStack>
        </XStack>
    );
};
