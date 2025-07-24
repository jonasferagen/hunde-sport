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

    const imageUrl = category.image?.src ?? '';

    return (
        <Link key={category.id} href={routes.category(category)} asChild>
            <BaseTile
                title={category.name}
                themeVariant={'primary'}
                imageUrl={imageUrl}
                {...props}
            />
        </Link>
    );
};
