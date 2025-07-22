import { CustomText, Icon } from '@/components/ui';
import { StyledButton, StyledButtonText } from '@/components/ui/button/StyledButton';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import React from 'react';
import { XStack } from 'tamagui';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
import { ProductTitle } from './display/ProductTitle';
import { ProductVariations } from './variation/ProductVariations';

export const BuyProduct = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { increaseQuantity, purchaseInfo } = useShoppingCartContext();
    const { status, msg } = purchaseInfo(displayProduct);

    return (
        <>
            <XStack alignItems="center" justifyContent="space-between">
                <ProductTitle product={product} activeProduct={displayProduct} />
                <PriceTag fontSize="xxl" product={displayProduct} />
            </XStack>
            <ProductVariations />
            <CustomText fontSize="sm">{product.short_description}</CustomText>
            <ProductStatus displayProduct={displayProduct} />

            <StyledButton
                icon={<Icon name="addToCart" />}
                onPress={() => increaseQuantity(displayProduct, product)}
                disabled={status !== 'ok'}
                variant="primary"
            >
                <StyledButtonText variant="primary">{msg}</StyledButtonText>
            </StyledButton>
        </>
    );
};