import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React, { JSX, ReactNode } from 'react';
import { Button, H3, Image, SizableText, XStack, YStack } from 'tamagui';

interface ProductItemHeaderProps {
    children?: ReactNode;
    categoryId?: number;
}

const IMAGE_SIZE = 80;

export const ProductItemHeader = ({ children, categoryId }: ProductItemHeaderProps): JSX.Element => {
    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;

    if (!activeProduct) {
        return <XStack />;
    }

    const imageUrl = getScaledImageUrl(activeProduct.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE);

    return (
        <>
            <Link href={routes.product(product, categoryId)} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <XStack
                        alignSelf="stretch"
                        jc="flex-start"
                        gap="$3"
                        flex={1}
                        padding="$2"
                    >
                        <YStack
                            ai="center"
                            jc="center"
                        >
                            <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                        </YStack>
                        <YStack gap="$2" jc="flex-start" flex={1}>
                            <H3>{product.name}</H3>
                            <SizableText fontSize="$1" color="$color" lineHeight={"$1"} textOverflow='ellipsis' numberOfLines={2}>
                                {product.short_description}
                            </SizableText>
                        </YStack>
                    </XStack>
                </Button>
            </Link>


        </>
    );
};
