import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { ChevronsDown, ChevronsUp } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { SizableText, StackProps, XStack, YStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariations } from '../variation/ProductVariations';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { product } = useProductContext();

    const productVariation = product.productVariation;


    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(prev => !prev);
    };


    return <YStack gap="$2" {...props}>
        <XStack gap="$3">
            <XStack w={PRODUCT_CARD_LEFT_COLUMN_WIDTH} />
            <XStack ai="center" jc="space-between" f={1} >
                <ProductStatus size="$2" />
                <SizableText>   {product.name}</SizableText>
                <DisplayPrice key={product.id + (product.productVariation?.id?.toString() || '')} productPrices={productVariation ? productVariation.prices : product.prices} />
            </XStack>
        </XStack>
        <XStack gap="$3" ai="center" jc="space-between">
            <ThemedButton
                theme="secondary_alt2"
                w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                p="none"
                m="none"
                gap={0}
                ai="center"
                jc="center"
                icon={isExpanded ? <ChevronsUp /> : <ChevronsDown />}
                scaleIcon={1.5}
                onPress={handleExpand}
                disabled={!(product instanceof VariableProduct)}
            />
            <PurchaseButton />
        </XStack>
        {isExpanded && <ProductVariations />}
    </YStack>
};
