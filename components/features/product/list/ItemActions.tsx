import { Icon } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { useShoppingCartContext, useThemeContext } from '@/contexts';
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
    quantity: number;
    handleExpand: () => void;
    handleIncrease: () => void;
    handleDecrease: () => void;
}

export const ItemActions = ({
    product,
    activeProduct,
    isExpanded,
    quantity,
    handleExpand,
    handleIncrease,
    handleDecrease
}: ItemActionsProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');
    const { purchaseInfo } = useShoppingCartContext();
    const { status } = purchaseInfo(activeProduct);
    const isPurchasable = status === 'ok';
    return (
        <>
            <XStack justifyContent="space-between" alignItems="center" padding="$1" >
                <XStack gap="$3" alignItems="center">
                    {product.type === 'variable' && (
                        <XStack onPress={handleExpand} gap="$2" alignItems="center" marginLeft="$2">
                            <Icon name="dot" size="xs" color={theme.text.primary} />
                            {activeProduct.type !== 'variation' && (
                                <CustomText fontSize="md" color="$gray10">
                                    Velg variant
                                </CustomText>
                            )}
                            {activeProduct.type === 'variation' && (
                                <CustomText fontSize="md" color="$gray10">
                                    {product.name} - <CustomText bold fontSize="md" color="$gray10">{activeProduct.name.trim()}</CustomText>
                                </CustomText>
                            )}
                            {activeProduct.type === 'variation' && (
                                <CustomText bold fontSize="md" color="$gray10">
                                    á {formatPrice(activeProduct.price)}
                                </CustomText>
                            )}
                        </XStack>
                    )}

                </XStack>

                <XStack gap="$2">
                    {activeProduct.stock_status === 'outofstock' && (
                        <CustomText fontSize="md" color="$gray10">Ikke på lager</CustomText>
                    )}
                    {isPurchasable && (
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    )}
                </XStack>
            </XStack>
            <YStack display={isExpanded ? 'flex' : 'none'} marginHorizontal="$3" marginTop="$2">
                <ProductVariations />
            </YStack>
        </>
    );
};
