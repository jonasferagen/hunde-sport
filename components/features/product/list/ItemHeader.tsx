import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useProductContext, useThemeContext } from '@/contexts';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { SimpleItemHeader } from './SimpleItemHeader';

interface ItemHeaderProps {
    product: Product;
    activeProduct: Product;
    categoryId?: number;
}

export const ItemHeader = ({ product, activeProduct, categoryId }: ItemHeaderProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');
    const { priceRange } = useProductContext();

    return (
        <Link href={routes.product(product, categoryId)} asChild>
            <XStack>
                <SimpleItemHeader product={activeProduct}>
                    <XStack justifyContent="space-between" alignItems="flex-start">
                        {/* The ProductTitle is inside SimpleItemHeader, so this is for price and description */}
                        {priceRange ? (
                            <CustomText bold color={theme.text.primary}>
                                Fra {formatPrice(priceRange.min)}
                            </CustomText>
                        ) : <PriceTag product={product} />}
                    </XStack>

                    <CustomText fontSize="xs" color={theme.text.primary} numberOfLines={2}>
                        {product.short_description}
                    </CustomText>
                </SimpleItemHeader>
            </XStack>
        </Link>
    );
};
