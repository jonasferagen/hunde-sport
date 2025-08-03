import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { useCategoryContext, useProductContext } from '@/contexts';

import { HrefObject } from 'expo-router';
import React from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps { }

export const ProductCard = ({ ...props }: ProductCardProps) => {
    const { product } = useProductContext();
    const { category } = useCategoryContext();

    const href: HrefObject = routes.product.path(product, category?.id);

    return <YStack {...props} gap="$2" p="$3">
        <ThemedLinearGradient />
        <XStack f={1} gap="$2" ai="center" jc="space-between">
            <ProductCardLeft href={href} />
            <ProductCardRight href={href} />
        </XStack>
        <ProductCardFooter />
    </YStack>

};
