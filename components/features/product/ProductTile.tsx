import { Tile, TileBadge } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import React from 'react';
import { YStackProps } from "tamagui";
import { PriceTag } from './display/PriceTag';

import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { Link } from 'expo-router';
import { DimensionValue } from "react-native";

interface ProductTileProps extends YStackProps {
    width?: DimensionValue;
    height?: DimensionValue;
}

export const ProductTile: React.FC<ProductTileProps> = ({

    width = PRODUCT_TILE_WIDTH,
    height = PRODUCT_TILE_HEIGHT,
    ...stackProps
}) => {
    const { product } = useBaseProductContext();

    return (
        <Link href={routes['product'].path(product)} asChild>
            <Tile
                w={width}
                h={height}
                title={product.name}
                image={product.featuredImage}
                {...stackProps}
            >

                <TileBadge >
                    <PriceTag />
                </TileBadge>

            </Tile>
        </Link>
    );
};
