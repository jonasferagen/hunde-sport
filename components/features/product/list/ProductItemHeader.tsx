import { routes } from '@/config/routes';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { JSX, ReactNode } from 'react';
import { Pressable } from 'react-native';
import { Button, H3, H6, Image, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';

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
                padding="$2"

            >
                <YStack>
                    <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                </YStack>
                <YStack flex={1}>
                    <Link href={routes.product(product, categoryId)} asChild>
                        <Button unstyled pressStyle={{ opacity: 0.7 }}>
                            <YStack gap="$2" jc="flex-start" flex={1} flexShrink={1}>
                                <H3>{product.name}</H3>
                                <SizableText fontSize="$1" color="$color" lineHeight={"$1"} textOverflow='ellipsis' numberOfLines={2}>
                                    {product.short_description}
                                </SizableText>
                            </YStack>
                        </Button>
                    </Link>
                    <BuyRow />
                </YStack>
            </XStack>
        </>
    );
};

const BuyRow = () => {
    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;
    return (
        <XStack ai='center' jc='space-between' flex={0} >
            <XStack gap="$2" flex={1}>
                {productVariation && <H6>{product.name}</H6>}
                <PriceTag />
                <ProductStatus />
            </XStack>
            <XStack flex={0} gap="$2" ai='center'>
                <Pressable onPress={() => useShoppingCartContext().increaseQuantity(product, productVariation || undefined)}>
                    <ShoppingCart size="$3" />
                </Pressable>
            </XStack>
        </XStack>
    );
};
