import { Button, CustomText } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import React from 'react';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
import { ProductTitle } from './display/ProductTitle';
import { ProductVariations } from './variation/ProductVariations';
export const BuyProduct = ({ product, displayProduct }: { product: Product; displayProduct: Product }) => {
    const { addToCart, purchaseInfo } = useShoppingCartContext();
    const { status, msg } = purchaseInfo(displayProduct);

    return <>
        <Row alignItems="center" justifyContent="space-between">
            <ProductTitle product={product} displayProduct={displayProduct} />
            <PriceTag fontSize="xxl" product={displayProduct} />
        </Row>

        <ProductVariations />
        <CustomText fontSize="sm">{product.short_description}</CustomText>
        <ProductStatus displayProduct={displayProduct} />

        <Button
            icon="addToCart"
            title={msg}
            onPress={() => addToCart(displayProduct)}
            disabled={status !== 'ok'}
        />
    </>;
};