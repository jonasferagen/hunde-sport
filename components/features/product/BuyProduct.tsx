import { useProductContext, useShoppingCartContext } from '@/contexts';
import { ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, SizableText, XStack } from 'tamagui';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
import { ProductTitle } from './display/ProductTitle';
import { ProductVariations } from './variation/ProductVariations';

export const BuyProduct = () => {
    const { product, productVariant } = useProductContext();
    const { increaseQuantity, purchaseInfo } = useShoppingCartContext();

    const activeProduct = productVariant || product;

    const { status, msg } = purchaseInfo(activeProduct);

    return (
        <>
            <XStack alignItems="center" justifyContent="space-between">
                <ProductTitle />
                <PriceTag fontSize="$6" />
            </XStack>
            <ProductVariations />
            <SizableText size="$3">{product.short_description}</SizableText>
            <ProductStatus />

            <Button
                icon={<ShoppingCart />}
                onPress={() => increaseQuantity(activeProduct, product)}
                disabled={status !== 'ok'}
                theme="blue"
            >
                {msg}
            </Button>
        </>
    );
};