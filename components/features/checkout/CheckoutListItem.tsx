import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { ProductProvider } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

interface CheckoutListItemProps {
    item: ShoppingCartItem;
}

const CheckoutListItemContent = ({ item }: CheckoutListItemProps) => {
    const { quantity, price } = item;
    const subtotal = price * quantity;

    return (
        <XStack jc="space-between" ai="center" paddingVertical="$2" paddingHorizontal="$4" borderBottomWidth={1} borderColor="$gray5">
            <XStack flex={2}>
                <ProductTitle size="$3" />
            </XStack>
            <SizableText flex={1} textAlign="right" fontSize="$3">
                {formatPrice(price)}
            </SizableText>
            <SizableText flex={1} textAlign="center" fontSize="$3">
                {quantity}
            </SizableText>
            <SizableText flex={1} textAlign="right" fontSize="$3" fontWeight="bold">
                {formatPrice(subtotal)}
            </SizableText>
        </XStack>
    );
};

export const CheckoutListItem = ({ item }: CheckoutListItemProps) => {
    return (
        <ProductProvider product={item.purchasable.product} productVariation={item.purchasable.productVariation}>
            <CheckoutListItemContent item={item} />
        </ProductProvider>
    );
};