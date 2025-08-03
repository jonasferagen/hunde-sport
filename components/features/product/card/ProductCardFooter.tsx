import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { Product, ProductVariation } from '@/types';
import { ChevronDown, ChevronUp, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { SizableText, StackProps, XStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';

interface ProductCardFooterProps {
    isExpanded?: boolean;
    handleExpand?: () => void;
}

const BuyInfo = ({ product, productVariation }: { product: Product, productVariation?: ProductVariation }) => {
    const { displayName } = useProductContext();
    return <XStack f={1} fs={1} gap="$2" ai="center" jc="space-between" >
        <SizableText numberOfLines={1} allowFontScaling fos="$3" fow="bold">{displayName}</SizableText>
        <DisplayPrice productPrices={productVariation ? productVariation.prices : product.prices} />
    </XStack>

}


export const ProductCardFooter = ({ isExpanded, handleExpand }: ProductCardFooterProps & StackProps) => {
    const { product, productVariation, displayName } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addCartItem({ product, productVariation });
    };


    return <>

        <XStack jc="space-between" gap="$2">
            <XStack w={80}>
                <ProductStatus size="$2" />
            </XStack>
            <BuyInfo product={product} productVariation={productVariation} />
        </XStack>
        <XStack f={1} w="100%" gap="$2" ai="center" jc="space-between">
            <ThemedButton
                w={80}
                theme="blue_alt1"
                onPress={handleExpand}
                disabled={!product.hasVariations()}
                gap={0}
                ai="center"
                jc="center"
            >
                {isExpanded ? <ChevronUp size="$4" /> : <ChevronDown size="$4" />}

            </ThemedButton>

            <ThemedButton
                f={1}
                theme="orange_alt1"
                onPress={handleAddToCart}
                ref={buttonRef}
                disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
                o={!activeProduct.isPurchasable() || !activeProduct.isInStock() ? 0.5 : 1}
                jc="space-between"
            >

                <SizableText>Legg til i handlekurv</SizableText>

                <XStack>
                    <ShoppingCart size="$4" />

                </XStack>
            </ThemedButton>
        </XStack>


    </>
};
