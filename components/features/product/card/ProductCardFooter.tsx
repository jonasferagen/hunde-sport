import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext } from '@/contexts';
import { ChevronsDown, ChevronsUp } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { SizableText, StackProps, XStack, YStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';
import { PurchaseButton, PurchaseButtonTheme } from '../display/PurchaseButton';
import { ProductVariations } from '../variation/ProductVariations';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './index';
interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { product, productVariation, displayName } = useProductContext();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(prev => !prev);
    };


    return <YStack gap="$2" {...props}>
        <XStack jc="space-between" gap="$3">
            <XStack w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}>
                <ProductStatus size="$2" />
            </XStack>
            <XStack f={1} fs={1} gap="$3" ai="center" jc="space-between" >
                <SizableText numberOfLines={1} allowFontScaling fos="$3" fow="bold">{displayName}</SizableText>
                <DisplayPrice productPrices={productVariation ? productVariation.prices : product.prices} />
            </XStack>
        </XStack>
        <XStack gap="$3" ai="center" jc="space-between" theme={PurchaseButtonTheme}>

            <ThemedButton
                onPress={handleExpand}
                disabled={!product.hasVariations()}
                gap={0}
                ai="center"
                jc="center"
                p="none"
                m="none"
                icon={isExpanded ? <ChevronsUp /> : <ChevronsDown />}
                w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                variant="accent"
                scaleIcon={1.5}
            />

            <PurchaseButton />
        </XStack>
        {isExpanded && <ProductVariations />}
    </YStack>
};
