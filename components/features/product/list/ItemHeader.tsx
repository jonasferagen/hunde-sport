import { routes } from '@/config/routes';
import { useProductContext, useThemeContext } from '@/contexts';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { SizableText, XStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { SimpleItemHeader } from './SimpleItemHeader';

interface ItemHeaderProps {
    categoryId?: number;
}

export const ItemHeader = ({ categoryId }: ItemHeaderProps): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');
    const { product } = useProductContext();

    if (!product) {
        return <XStack />;
    }

    return (
        <Link href={routes.product(product, categoryId)} asChild>
            <XStack>
                <SimpleItemHeader>
                    <PriceTag />
                    <SizableText fontSize="$1" color={theme.text.primary} numberOfLines={2}>
                        {product.short_description}
                    </SizableText>
                </SimpleItemHeader>
            </XStack>
        </Link>
    );
};
