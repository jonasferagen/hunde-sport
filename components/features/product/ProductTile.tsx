import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { DimensionValue } from 'react-native';
import { ThemeName, YStack, YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

export const PRODUCT_TILE_WIDTH: DimensionValue = 120;
export const PRODUCT_TILE_HEIGHT: DimensionValue = 100;

interface ProductTileProps extends YStackProps {
    product: SimpleProduct | VariableProduct
}

export const ProductTile: React.FC<ProductTileProps> = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const handlePress = () => {
        // Pre-populate the cache for the specific product query
        queryClient.setQueryData(['product', product.id], product);
        // Navigate to the product screen
        router.push(routes.product.path(product));
    };

    return (
        <Tile
            onPress={handlePress}
            w={width}
            h={height}
            title={product.name + ' ' + product.id}
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
