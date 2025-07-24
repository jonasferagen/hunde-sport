import { BaseTile, ThemeVariant } from "@/components/ui/tile/BaseTile";
import { routes } from '@/config/routes';
import { CARD_DIMENSIONS } from '@/styles';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from 'react-native';
import { View, YStack } from 'tamagui';
import { PriceTag } from './display/PriceTag';

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: ThemeVariant;
}

export const ProductTile = ({
    product,
    width = CARD_DIMENSIONS.product.width,
    height = CARD_DIMENSIONS.product.height,
    themeVariant = 'primary'
}: ProductTileProps) => {


    return (
        <Link href={routes.product(product)} asChild>
            <YStack
                height={height}
                width={width}
                borderRadius="$3"
                overflow="hidden"

            >
                <BaseTile
                    width={width}
                    height={height}
                    themeVariant={themeVariant}
                    title={product.name}
                    imageUrl={product.image?.src ?? ''}
                    titleNumberOfLines={2}
                    gradientMinHeight={40}
                />
                <View
                    position="absolute"
                    top="$2"
                    right="$2"
                    backgroundColor="$background0.5"
                    paddingVertical="$2"
                    paddingHorizontal="$3"
                    borderRadius="$3"
                >
                    <PriceTag product={product} />
                </View>
            </YStack>
        </Link>
    );
};