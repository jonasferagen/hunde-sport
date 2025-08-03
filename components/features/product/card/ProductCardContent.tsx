import { Chip } from '@/components/ui';
import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H6, SizableText, XStack, YStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';

interface ProductCardContentProps {
    categoryId?: number;
}

export const ProductCardContent = ({ categoryId }: ProductCardContentProps) => {
    const { product, displayName, productVariation } = useProductContext();

    if (productVariation) {
        console.log(productVariation.prices);
    }

    return <YStack f={1}>
        <Link href={routes.product.path(product, categoryId)} asChild>
            <Button unstyled pressStyle={{ opacity: 0.7 }}>
                <YStack gap="$2" jc="flex-start" f={1} fs={1}>
                    <XStack gap="$2" ai="flex-start" jc="space-between">
                        <H6 f={0} fs={1} numberOfLines={2} textDecorationLine="none" hoverStyle={{ color: '$colorHover' }} >
                            {product.name}
                        </H6>
                        <YStack gap="$1" jc="center" ai="center">
                            <Chip theme="tertiary" minWidth={80}>
                                <DisplayPrice productPrices={product.prices} size="$2" />
                            </Chip>
                        </YStack>
                    </XStack>
                    <SizableText fos="$1" col="$color" lh={"$1"} textDecorationLine="none" numberOfLines={2} hoverStyle={{ color: '$colorHover' }} >
                        {product.short_description}
                    </SizableText>
                </YStack>
            </Button>
        </Link>
    </YStack>

};
