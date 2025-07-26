import { routes } from '@/config/routes';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { ChevronsDown, ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { JSX, ReactNode } from 'react';
import { Button, H3, Image, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { ProductVariations } from '../variation/ProductVariations';

interface ProductItemHeaderProps {
    children?: ReactNode;
    categoryId?: number;
    isExpanded: boolean;
    handleExpand: () => void;
}

const IMAGE_SIZE = 80;

export const ProductItemHeader = ({ children, categoryId, isExpanded, handleExpand }: ProductItemHeaderProps): JSX.Element => {
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
                    <Link href={routes.product(product, categoryId)}>
                        <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                    </Link>
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

            {product.type === 'variable' && (
                <YStack marginHorizontal="$3" mt="$2">
                    <ProductVariations />
                </YStack>
            )}
        </>
    );
};

const BuyRow = () => {
    const { product, productVariation } = useProductContext();
    const { increaseQuantity } = useShoppingCartContext();
    const activeProduct = productVariation || product;


    return (
        <XStack ai='center' jc='space-between' flex={0} marginTop="$2">
            <XStack gap="$2" ai="center" flex={1}>
                <PriceTag />
                {productVariation && <SizableText textTransform="capitalize">{productVariation.name}</SizableText>}
                <ProductStatus />
            </XStack>
            <XStack flex={0} gap="$2" ai='center' theme="accent">

                {activeProduct.isPurchasable() && activeProduct.isInStock() && (
                    <Button
                        icon={<ShoppingCart fontSize="$4" fontWeight="bold" />}
                        onPress={() => increaseQuantity(product, productVariation || undefined)}
                        circular
                        size="$5"

                    />
                )}
                {!activeProduct.isPurchasable() && (
                    <XStack ai="center">
                        <SizableText>Velg variant</SizableText>
                        <ChevronsDown size="$3" />
                    </XStack>
                )}
            </XStack>
        </XStack>
    );
};
