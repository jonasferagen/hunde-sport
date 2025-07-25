import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { Separator, Text, YStack } from 'tamagui';
import { CheckoutListItem } from './CheckoutListItem';

interface CheckoutListProps {
    items: ShoppingCartItem[];
    cartTotal: number;
}

export const CheckoutList: React.FC<CheckoutListProps> = ({ items, cartTotal }) => {
    return (
        <YStack>
            {items.map((item: ShoppingCartItem) => (
                <CheckoutListItem
                    key={item.product.id.toString() + (item.productVariation?.id?.toString() || '')}
                    item={item}
                />
            ))}
            <Separator my="$2" />
            <YStack ai="flex-end" gap="$2">
                <Text fontSize="$6" fontWeight="bold">
                    Total
                </Text>
                <Text fontSize="$7" fontWeight="bold">
                    {formatPrice(cartTotal)}
                </Text>
            </YStack>
        </YStack>
    );
};
