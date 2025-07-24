import { ThemeVariant, Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { CARD_DIMENSIONS } from '@/styles';
import React from 'react';
import { DimensionValue } from 'react-native';

interface CategoryTileProps {
    category: Category;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: ThemeVariant;
}
export const CategoryTile = ({
    category,
    width = CARD_DIMENSIONS.category.width,
    height = CARD_DIMENSIONS.category.height,
    themeVariant,
    ...props
}: CategoryTileProps) => {


    const finalHref = routes.category(category);

    return (

        <Tile
            title={category.name}
            themeVariant={themeVariant ?? 'primary'}
            imageUrl={category.image?.src}
            href={finalHref}
            {...props}

        >
            <></>
        </Tile>

    );
};
