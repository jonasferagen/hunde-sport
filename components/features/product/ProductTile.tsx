import { Tile } from "@/components/ui/tile/Tile";
import { TileBadge } from "@/components/ui/tile/TileBadge";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { Link } from 'expo-router';
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


    return (
        <Link href={routes.product.path(product)}>
            <Tile
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
        </Link>
    );
};
