import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useProductContext, useThemeContext } from '@/contexts';
import { Product } from '@/models/Product';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { Image, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductTitle } from '../display/ProductTitle';

interface ItemHeaderProps {
    product: Product;
    activeProduct: Product;
    categoryId?: number;
}

export const ItemHeader = ({ product, activeProduct, categoryId }: ItemHeaderProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');
    const IMAGE_SIZE = 80;
    const imageUrl = getScaledImageUrl(activeProduct.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE);
    const { priceRange, productVariant } = useProductContext();
    return (
        <Link href={routes.product(product, categoryId)} asChild>
            <XStack justifyContent="space-between" gap="$3">
                <XStack
                    alignSelf="stretch"
                    justifyContent="flex-start"
                    gap="$3"
                    style={{ width: '100%' }}
                >
                    <YStack
                        alignItems="center"
                        justifyContent="center"

                    >
                        <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                    </YStack>


                    <YStack flex={1} gap="$2" >
                        <XStack justifyContent="space-between" alignItems="flex-start">
                            <YStack flex={1} paddingRight="$2">
                                <ProductTitle product={product} />
                            </YStack>
                            {priceRange ? (
                                <CustomText bold color={theme.text.primary}>
                                    Fra {formatPrice(priceRange.min)}
                                </CustomText>
                            ) : <PriceTag product={product} />}
                        </XStack>

                        <CustomText fontSize="xs" color={theme.text.primary} numberOfLines={2}>
                            {product.short_description}
                        </CustomText>
                    </YStack>
                </XStack>
            </XStack>
        </Link>
    );
};
