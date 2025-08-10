import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { useProductCategoryContext, useProductContext } from '@/contexts';

import { ThemedXStack, ThemedYStack } from '@/components/ui/ThemedStack';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, StackProps } from 'tamagui';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps { }

export const ProductCard = ({ ...props }: ProductCardProps) => {
    const { purchasable } = useProductContext();
    const { productCategory: category } = useProductCategoryContext();

    const href: HrefObject = routes.product.path(purchasable.product, category?.id);


    return (
        <ThemedYStack p="$3" gap="none" {...props} boc="$borderColor" bbw={1} f={1}>
            <ThemedLinearGradient />
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <ThemedXStack>
                        <ProductCardLeft href={href} purchasable={purchasable} />
                        <ProductCardRight href={href} purchasable={purchasable} />
                    </ThemedXStack>
                </Button>
            </Link>
            <ProductCardFooter purchasable={purchasable} />
        </ThemedYStack>
    );
};
