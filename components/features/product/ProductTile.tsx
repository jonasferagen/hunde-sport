import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import { Product } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { ThemeName, YStack, YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';

interface ProductTileProps extends YStackProps {
    product: Product
    width?: number;
    height?: number;
}

export const ProductTile: React.FC<ProductTileProps> = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {
    const router = useRouter();
    const handlePress = () => {
        router.push(routes.product.path(product));
    };

    return (
        <Tile
            onPress={handlePress}
            w={width}
            h={height}
            title={product.name}
            imageUrl={product.featuredImage.src}
            titleNumberOfLines={1}
            {...stackProps}
        >
            <ProductProvider product={product}>
                <YStack>
                    <TileBadge theme={stackProps.theme as ThemeName} >
                        <PriceTag />
                    </TileBadge>
                </YStack>
            </ProductProvider>
        </Tile>
    );
};
