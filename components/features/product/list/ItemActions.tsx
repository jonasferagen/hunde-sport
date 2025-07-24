import { Icon } from '@/components/ui';
import { useProductContext, useThemeContext } from '@/contexts';
import { formatPrice } from '@/utils/helpers';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { QuantityControl } from '../../shoppingCart/QuantityControl';
import { ProductVariations } from '../variation/ProductVariations';

interface ItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

const VariantSelectionText = () => {
    const { product, productVariant } = useProductContext();
    const activeProduct = productVariant || product;

    if (!activeProduct || !product) {
        return null;
    }

    if (activeProduct.type === 'variation') {
        return (
            <>
                <SizableText color="$gray10">
                    {product.name} - <SizableText fontWeight="bold" color="$gray10">{activeProduct.name.trim()}</SizableText>
                </SizableText>
                <SizableText fontWeight="bold" color="$gray10">
                    {formatPrice(activeProduct.price)}
                </SizableText>
            </>
        );
    }

    return (
        <SizableText color="$gray10">
            Velg variant
        </SizableText>
    );
};

export const ItemActions = ({
    isExpanded,
    handleExpand
}: ItemActionsProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');
    const { product, productVariant } = useProductContext();
    const activeProduct = productVariant || product;

    if (!product || !activeProduct) {
        return <YStack />;
    }

    return (
        <YStack>
            <XStack jc="space-between" ai="center" padding="$1">
                <XStack gap="$3" alignItems="center">
                    {product.type === 'variable' && (
                        <XStack onPress={handleExpand} gap="$2" ai="center" ml="$2">
                            <Icon name="dot" size="xs" color={theme.text.primary} />
                            <VariantSelectionText />
                        </XStack>
                    )}
                </XStack>

                <XStack gap="$2" ai='center'>
                    {activeProduct.stock_status === 'outofstock' || true && (
                        <SizableText color="red">Ikke på lager</SizableText>
                    )}
                    <QuantityControl product={activeProduct} baseProduct={product} />
                </XStack>
            </XStack>
            {isExpanded && (
                <YStack marginHorizontal="$3" marginTop="$2">

                    <ProductVariations />
                </YStack>
            )}
        </YStack>
    );
};
