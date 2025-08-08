import { Tile, TileBadge } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { ProductProvider } from '@/contexts';
import React from 'react';
import { YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { Product } from '@/models/Product/Product';
import { Link } from 'expo-router';
import { DimensionValue } from "react-native";

interface ProductTileProps extends YStackProps {
    product: Product
    width?: DimensionValue;
    height?: DimensionValue;
}

export const ProductTile: React.FC<ProductTileProps> = ({
    product,
    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {



    return (
        <Link href={routes['product'].path(product)} asChild>
            <Tile
                w={width}
                h={height}
                title={product.name}
                image={product.featuredImage}
                {...stackProps}
            >
                <ProductProvider product={product}>
                    <TileBadge bg="transparent">
                        <PriceTag />
                    </TileBadge>
                </ProductProvider>
            </Tile>
        </Link>
    );
};
