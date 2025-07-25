import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { Text, XStack } from 'tamagui';

interface CheckoutListItemProps {
    item: ShoppingCartItem;
}

export const CheckoutListItem: React.FC<CheckoutListItemProps> = ({ item }) => {
    const product = item.product;
    const subtotal = product.price * item.quantity;
    const productVariation = item.productVariation;
    return (
        <XStack
            jc="space-between"
            paddingVertical="$2"
            borderBottomWidth={1}
            borderColor="$borderColor"
            ai="center"
        >
            <Text flex={1} fow="bold">
                {item.product.name} ({item.quantity})
            </Text>
            {productVariation && (
                <Text flex={1} fos="$2" ml="$2">
                    {productVariation.name}
                </Text>
            )}
            <Text fow="bold" miw={80} ta="right">
                {formatPrice(subtotal)}
            </Text>
        </XStack>
    );
};