import { ThemedLinearGradient } from '@/components/ui';
import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { routes } from '@/config/routes';
import { useProductCategoryContext } from '@/contexts';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { getScaledImageUrl } from '@/lib/helpers';
import { HrefObject, Link } from 'expo-router';
import React, { JSX } from 'react';
import { Button, StackProps, useThemeName, XStack, YStack } from 'tamagui';
import { ProductDescription, ProductTitle } from '.';
import { ProductPurchaseFlow } from '../purchase/ProductPurchaseFlow';


export const PRODUCT_CARD_NARROW_COLUMN_WIDTH = 80;

export const ProductCard = React.memo(({ ...props }: StackProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { productCategory: category } = useProductCategoryContext();

    const themeName = useThemeName();
    console.log(themeName, props.theme);

    const href: HrefObject = routes.product.path(product, category?.id);
    return (
        <ThemedYStack preset="container" theme={props.theme} {...props} bbw={1} f={1} >
            <ThemedLinearGradient />
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <ThemedXStack>
                        <ProductCardImage />
                        <ProductCardDescription />
                    </ThemedXStack>
                </Button>
            </Link>
            <ProductPurchaseFlow />
        </ThemedYStack>
    );
});

const ProductCardImage = ({ ...props }: StackProps): JSX.Element => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const imageSize = PRODUCT_CARD_NARROW_COLUMN_WIDTH;
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

const ProductCardDescription = ({ ...stackProps }: StackProps): JSX.Element => {
    return (
        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="flex-start"
                jc="space-between"
            >
                <ProductTitle fs={1} />

            </XStack>
            <ProductDescription
                numberOfLines={2}
                short={true}
                fow="normal"
            />
        </ThemedYStack>
    );
};
