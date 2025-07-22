import { Icon } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import React, { JSX } from 'react';
import { XStack, YStack } from 'tamagui';
import { QuantityControl } from '../../shoppingCart/QuantityControl';
import { ProductVariations } from '../variation/ProductVariations';

interface ItemActionsProps {
    product: Product;
    activeProduct: Product;
    isExpanded: boolean;
    handleExpand: () => void;
}

interface VariantSelectionTextProps {
    product: Product;
    activeProduct: Product;
}

const VariantSelectionText = ({ product, activeProduct }: VariantSelectionTextProps) => {
    if (activeProduct.type === 'variation') {
        return (
            <>
                <CustomText fontSize="md" color="$gray10">
                    {product.name} - <CustomText bold fontSize="md" color="$gray10">{activeProduct.name.trim()}</CustomText>
                </CustomText>
                <CustomText bold fontSize="md" color="$gray10">
                    á {formatPrice(activeProduct.price)}
                </CustomText>
            </>
        );
    }

    return (
        <CustomText fontSize="md" color="$gray10">
            Velg variant
        </CustomText>
    );
};

export const ItemActions = ({
    product,
    activeProduct,
    isExpanded,
    handleExpand
}: ItemActionsProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');

    return (
        <YStack>
            <XStack justifyContent="space-between" alignItems="center" padding="$1">
                <XStack gap="$3" alignItems="center">
                    {product.type === 'variable' && (
                        <XStack onPress={handleExpand} gap="$2" alignItems="center" marginLeft="$2">
                            <Icon name="dot" size="xs" color={theme.text.primary} />
                            <VariantSelectionText product={product} activeProduct={activeProduct} />
                        </XStack>
                    )}
                </XStack>

                <XStack gap="$2">
                    {activeProduct.stock_status === 'outofstock' && (
                        <CustomText fontSize="md" color="$gray10">Ikke på lager</CustomText>
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
