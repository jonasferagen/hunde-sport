import { BaseTile, BaseTileProps } from '@/components/ui/tile/BaseTile';
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { Link } from 'expo-router';
import React from 'react';

interface CategoryTileProps extends BaseTileProps {
    category: Category;
}

export const CategoryTile = ({
    category,
    ...props
}: CategoryTileProps) => {

    const { name, image } = category;
    const imageUrl = image?.src ?? '';

    return (
        <Link href={routes.category(category)} asChild>
            <BaseTile
                name={name}
                themeVariant={'primary'}
                imageUrl={imageUrl}
                {...props}
            />
        </Link>
    );
};
