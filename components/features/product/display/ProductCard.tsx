import { ThemedImage } from '@/components/ui';
import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { ThemedXStack, ThemedYStack } from '@/components/ui/themed-components/ThemedStacks';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { getScaledImageUrl } from '@/lib/helpers';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductPurchaseFlow } from '../purchase/ProductPurchaseFlow';
import { ProductDescription } from './ProductDescription';
import { ProductTitle } from './ProductTitle';

const IMAGE_SIZE = 80;
export const ProductCard = React.memo(({ ...props }: StackProps) => {

    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    const { linkProps } = useCanonicalNavigation();

    return (
        <ThemedYStack
            container
            box
            {...props}
        >
            <ThemedLinearGradient />
            <Link {...linkProps('product', product)} asChild>
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

    const uri = getScaledImageUrl(product.featuredImage.src, IMAGE_SIZE, IMAGE_SIZE);
    return (
        <YStack
            w={IMAGE_SIZE}
            h={IMAGE_SIZE}
            bw={1}
            boc="$borderColor"
            br="$3"
            ov="hidden"
            {...props}
        ><ThemedImage
                uri={uri}
                title={product.name}
                w={IMAGE_SIZE}
                h={IMAGE_SIZE}
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
                <ProductTitle size="$5" fs={1} />

            </XStack>
            <ProductDescription
                numberOfLines={2}
                fow="normal"
            />
        </ThemedYStack>
    );
};
