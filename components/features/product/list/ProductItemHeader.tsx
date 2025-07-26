import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React, { JSX, ReactNode } from 'react';
import { Button, Image, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';

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
            <XStack
                alignSelf="stretch"
                jc="flex-start"
                gap="$3"
                flex={1}
            >
                <YStack
                    ai="center"
                    jc="center"
                >
                    <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                </YStack>
                <YStack flex={1} gap="$2">
                    <Link href={routes.product(product, categoryId)} asChild>
                        <Button unstyled pressStyle={{ opacity: 0.7 }}>
                            <ProductTitle />
                            <SizableText fontSize="$1" color="$color" numberOfLines={2}>
                                {product.short_description}
                            </SizableText>
                        </Button>
                    </Link>
                </YStack>
            </XStack>
            <XStack ai="center" gap="$2">
                <PriceTag /><ProductStatus /><Button>Kjøp</Button>
            </XStack>
        </>
    );
};
