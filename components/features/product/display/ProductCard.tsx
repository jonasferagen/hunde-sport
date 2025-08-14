import { ThemedImage } from '@/components/ui';
import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { routes } from '@/config/routes';
import { useProductCategoryContext } from '@/contexts';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { HrefObject, Link } from 'expo-router';
import React, { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductDescription, ProductTitle } from '.';
import { ProductPurchaseFlow } from '../purchase/ProductPurchaseFlow';


export const PRODUCT_CARD_NARROW_COLUMN_WIDTH = 80;

export const ProductCard = React.memo(({ ...props }: StackProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { productCategory: category } = useProductCategoryContext();

    const href: HrefObject = routes.product.path(product, category?.id);


    return (
        <ThemedYStack
            container
            bbw={1}
            boc="$borderColor"
            {...props} >
            <Link href={href} asChild>
                <ThemedXStack pressable>
                    <ProductCardImage />
                    <ProductCardDescription />
                </ThemedXStack>
            </Link>
            <ProductPurchaseFlow />

        </ThemedYStack>
    );


});

const ProductCardImage = ({ ...props }: StackProps): JSX.Element => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const imageSize = PRODUCT_CARD_NARROW_COLUMN_WIDTH;

    return (
        <YStack
            w={imageSize}
            h={imageSize}
            bw={1}
            boc="$borderColor"
            br="$3"
            ov="hidden"
            {...props}
        ><ThemedImage

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
        <ThemedYStack
            f={1}
            jc="flex-start"
            gap="$2"
            {...stackProps}>
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
