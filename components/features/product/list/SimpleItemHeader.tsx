import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import React, { JSX, ReactNode } from 'react';
import { Image, XStack, YStack } from 'tamagui';
import { ProductTitle } from '../display/ProductTitle';

interface SimpleItemHeaderProps {
    children?: ReactNode;
}

const IMAGE_SIZE = 80;

export const SimpleItemHeader = ({ children }: SimpleItemHeaderProps): JSX.Element => {
    const { product, productVariant } = useProductContext();
    const activeProduct = productVariant || product;

    if (!activeProduct) {
        return <XStack />;
    }

    const imageUrl = getScaledImageUrl(activeProduct.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE);

    return (
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
                <ProductTitle />
                {children}
            </YStack>
        </XStack>
    );
};
