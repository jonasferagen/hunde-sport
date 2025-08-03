import { Chip } from '@/components/ui';
import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H6, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';

interface ProductCardContentProps {
    categoryId?: number;
}

export const ProductCardContent = ({ categoryId }: ProductCardContentProps) => {
    const { product, displayName } = useProductContext();

    return <YStack f={1}>
        <Link href={routes.product.path(product, categoryId)} asChild>
            <Button unstyled pressStyle={{ opacity: 0.7 }}>
                <YStack gap="$2" jc="flex-start" f={1} fs={1}>
                    <XStack gap="$2" ai="center" jc="space-between">
                        <H6 f={0} fs={1} numberOfLines={2} textDecorationLine="none" hoverStyle={{ color: '$colorHover' }} >
                            {displayName}
                        </H6>
                        <Chip theme="tertiary" minWidth={80}>
                            <PriceTag size="$2" />
                        </Chip>
                    </XStack>

                    <SizableText fos="$1" col="$color" lh={"$1"} textDecorationLine="none" numberOfLines={2} hoverStyle={{ color: '$colorHover' }} >
                        {product.short_description}
                    </SizableText>
                </YStack>
            </Button>
        </Link>
    </YStack>

};
