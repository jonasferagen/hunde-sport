import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { useProductCategoryContext, useProductContext } from '@/contexts';

import { HrefObject } from 'expo-router';
import React from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps { }

export const ProductCard = ({ ...props }: ProductCardProps) => {
    const { product } = useProductContext();
    const { productCategory: category } = useProductCategoryContext();

    const href: HrefObject = routes.product.path(product, category?.id);

    return (
        <YStack {...props} bbc="$borderColor" bbw={1} p="$3" f={1}>
            <ThemedLinearGradient zIndex={-1} />
            <XStack gap="$3">
                <ProductCardLeft href={href} />
                <ProductCardRight href={href} />
            </XStack>
            <ProductCardFooter />
        </YStack>
    );
};
