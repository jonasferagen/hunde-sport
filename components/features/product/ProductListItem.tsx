import { routes } from '@/config/routes';
import { ProductProvider, useProductContext, useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { getScaledImageUrl } from '@/utils/helpers';
import { ChevronDown, ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H3, Image, SizableText, StackProps, XStack, YStack } from 'tamagui';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
import { ProductVariations } from './variation/ProductVariations';

interface ProductListItemProps extends Omit<StackProps, 'onPress'> {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

const IMAGE_SIZE = 80;


const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({
    onPress,
    isExpanded,
    categoryId,
    ...props
}) => {

    const { product, productVariation } = useProductContext();
    const { increaseQuantity } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const handleExpand = () => {
        onPress(product.id);
    };

    return (
        <YStack>
            <XStack
                alignSelf="stretch"
                jc="flex-start"
                gap="$3"
                padding="$2"
            >
                <YStack>
                    <Link href={routes.product(product, categoryId)}>
                        <Image source={{ uri: getScaledImageUrl(product.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE) }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
                    </Link>
                </YStack>
                <YStack flex={1} minHeight={IMAGE_SIZE}>
                    <Link href={routes.product(product, categoryId)} asChild>
                        <Button unstyled pressStyle={{ opacity: 0.7 }}>
                            <YStack gap="$2" jc="flex-start" flex={1} flexShrink={1}>
                                <H3>{product.name}</H3>
                                <SizableText fontSize="$1" color="$color" lineHeight={"\$1"} textOverflow='ellipsis' numberOfLines={2}>
                                    {product.short_description}
                                </SizableText>
                            </YStack>
                        </Button>
                    </Link>

                </YStack>
            </XStack>
            <XStack ai='center' jc='space-between' flex={0} gap="$2" marginHorizontal="$3" >
                <XStack gap="$2" ai="center" flex={1}>
                    <PriceTag />
                    <ProductStatus />
                    {product.hasVariations() && productVariation && <SizableText fontWeight="bold" >{productVariation.name}</SizableText>}
                </XStack>

                <XStack gap="$2" ai="center">
                    {product.hasVariations() &&
                        <YStack theme="secondary">
                            <Button
                                icon={<ChevronDown size="$4" fontWeight="bold" color="$color" />}
                                onPress={() => handleExpand()}
                                circular
                                size="$6"
                                disabled={!product.hasVariations()}
                                opacity={!product.hasVariations() ? 0.5 : 1}
                            />
                        </YStack>
                    }
                    <YStack theme="primary">
                        <Button
                            icon={<ShoppingCart fontSize="$5" fontWeight="bold" />}
                            onPress={() => increaseQuantity(product, productVariation || undefined)}
                            circular
                            size="$6"
                            disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
                            opacity={!activeProduct.isPurchasable() || !activeProduct.isInStock() ? 0.5 : 1}

                        />
                    </YStack>
                </XStack>
            </XStack>
            {
                product.type === 'variable' && isExpanded && (
                    <YStack marginHorizontal="$3" mt="$2">
                        <ProductVariations />
                    </YStack>
                )
            }
        </YStack >
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};
