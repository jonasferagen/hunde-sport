import { ProductCard, ProductCardImage } from '@/components/features/product/card';
import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, H5, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {
    const { increaseQuantity, decreaseQuantity } = useShoppingCartContext();
    const { product, productVariation, quantity } = item;
    const activeProduct = productVariation || product;

    return (
        <ProductCard>
            <ProductCardImage product={product} />
            <YStack flex={1} jc="center" gap="$2">
                <H5>{product.name}</H5>
                {productVariation && <SizableText>{productVariation.name}</SizableText>}
            </YStack>
            <XStack ai="center" gap="$3" theme="secondary">
                <Button icon={<Minus />} onPress={() => decreaseQuantity(product, productVariation)} size="$5" circular />
                <SizableText size="$5" width={30} textAlign="center">{quantity}</SizableText>
                <Button icon={<Plus />} onPress={() => increaseQuantity(product, productVariation)} size="$5" circular />
            </XStack>
            <SizableText width={80} textAlign="right" fontWeight="bold">{formatPrice(activeProduct.price * quantity)}</SizableText>
        </ProductCard>
    );
};

export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {
    return (
        <ProductProvider product={item.product}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
};
