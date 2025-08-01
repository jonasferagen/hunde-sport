import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H3, SizableText, YStack } from 'tamagui';

interface ProductCardContentProps {
    categoryId?: number;
}

export const ProductCardContent = ({ categoryId }: ProductCardContentProps) => {
    const { product } = useProductContext();
    return (
        <YStack
            flex={1}
            minHeight={80}
        >
            <Link href={routes.product.path(product, categoryId)} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <YStack gap="$2" jc="flex-start" flex={1} flexShrink={1}>
                        <H3 textDecorationLine="none" hoverStyle={{ color: '$colorHover' }}>{product.name}</H3>
                        <SizableText textDecorationLine="none" fontSize="$1" color="$color" lineHeight={"$1"} textOverflow='ellipsis' numberOfLines={2}>
                            {product.short_description}
                        </SizableText>
                    </YStack>
                </Button>
            </Link>
        </YStack>
    );
};
