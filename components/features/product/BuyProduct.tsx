import { CustomText, Icon } from '@/components/ui';
import { StyledButton, StyledButtonText } from '@/components/ui/button/StyledButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import React from 'react';
import { XStack } from 'tamagui';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
import { ProductTitle } from './display/ProductTitle';
import { ProductVariations } from './variation/ProductVariations';

export const BuyProduct = () => {
    const { product, productVariant } = useProductContext();
    const { increaseQuantity, purchaseInfo } = useShoppingCartContext();

    const activeProduct = productVariant || product;

    if (!product || !activeProduct) {
        return null;
    }

    const { status, msg } = purchaseInfo(activeProduct);

    return (
        <>
            <XStack alignItems="center" justifyContent="space-between">
                <ProductTitle />
                <PriceTag fontSize="$6" />
            </XStack>
            <ProductVariations />
            <CustomText fontSize="sm">{product.short_description}</CustomText>
            <ProductStatus />

            <StyledButton
                icon={<Icon name="addToCart" />}
                onPress={() => increaseQuantity(activeProduct, product)}
                disabled={status !== 'ok'}
                variant="primary"
            >
                <StyledButtonText variant="primary">{msg}</StyledButtonText>
            </StyledButton>
        </>
    );
};