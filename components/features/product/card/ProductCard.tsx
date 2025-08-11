import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { useProductCategoryContext } from '@/contexts';

import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, StackProps, XStack } from 'tamagui';

import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { usePurchasable } from '@/hooks/usePurchasable';
import { getScaledImageUrl } from '@/lib/helpers';
import { YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariationsButton } from '../product-variation/ProductVariationsButton';
import { ProductCardCTA } from './ProductCardCTA';

export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

export const ProductCard = ({ ...props }: StackProps) => {
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
                <ProductCardCTA />
            </ThemedYStack>
        </ThemedYStack>
    );
}


export const ProductCardLeft = ({ ...props }: StackProps) => {
    const { product } = useBaseProductContext();
    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(product.featuredImage.src, imageSize, imageSize);

    return (
        <YStack
            w={imageSize}
            h={imageSize}
            bw={1}
            boc="$borderColor"
            br="$3"
            ov="hidden"
            {...props}
        >
            <ThemedImage
                source={{ uri }}
                image={product.featuredImage}
                title={product.name}
                w={imageSize}
                h={imageSize}
            />
        </YStack>
    );
};

const ProductCardRight = ({ ...stackProps }: StackProps) => {
    return (
        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="flex-start"
                jc="space-between"
            >
                <ProductTitle fs={1} />
                <PriceTag
                    fs={0}
                    br="$5"
                    miw={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                />
            </XStack>
            <ProductDescription
                numberOfLines={2}
                short={true} />
        </ThemedYStack>
    );
};

const ProductCardFooter = ({ stackProps }: { stackProps?: StackProps }) => {

    const { isValid, status, product, message } = usePurchasable();

    if (isValid) {
        return <PurchaseButton />;
    }

    if (status === "INVALID") {
        return <ProductStatus f={1} ta="right" />
    }

    if (status === "ACTION_NEEDED") {
        return <ProductVariationsButton />;
    }
}