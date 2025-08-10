import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { useProductCategoryContext } from '@/contexts';

import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, StackProps } from 'tamagui';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps { }

export const ProductCard = ({ ...props }: ProductCardProps) => {
    const { product } = useBaseProductContext();
    const { productCategory: category } = useProductCategoryContext();

    const href: HrefObject = routes.product.path(product, category?.id);


    return (
        <ThemedYStack p="$3" gap="$3" {...props} boc="$borderColor" bbw={1} f={1}>
            <ThemedLinearGradient />
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <ThemedXStack>
                        <ProductCardLeft />
                        <ProductCardRight />
                    </ThemedXStack>
                </Button>
            </Link>
            <ThemedYStack p="none" w="100%" ai="flex-end" jc="flex-end">
                <ProductCardFooter />
            </ThemedYStack>
        </ThemedYStack>
    );
}