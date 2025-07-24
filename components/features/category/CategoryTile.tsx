import { BaseTileProps, Tile } from '@/components/ui/tile/Tile';
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import React from 'react';

interface CategoryTileProps extends BaseTileProps {
    category: Category;
}

export const CategoryTile = ({
    category,
    title,
    imageUrl,
    href,
    ...props
}: CategoryTileProps) => {

    const finalImageUrl = category.image.src ?? '';
    const finalHref = routes.category(category);

    return (

        <Tile
            title={title ?? category.name}
            themeVariant={'primary'}
            imageUrl={finalImageUrl}
            href={finalHref}
            {...props}
        />

    );
};
