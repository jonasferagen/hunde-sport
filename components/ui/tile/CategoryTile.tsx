import { COLORS } from '@/styles/Colors';
import type { Category } from '@/types';
import { BaseTile, type BaseTileProps } from './BaseTile';

interface CategoryTileProps extends Omit<BaseTileProps, 'name' | 'imageUrl' | 'topRightText'> {
    category: Category;
}

export const CategoryTile = ({ category, ...rest }: CategoryTileProps) => {

    if (!category.image) {
        return null;
    }

    return (
        <BaseTile
            name={category.name}
            imageUrl={category.image.src}
            mainColor={COLORS.primary}
            {...rest}
        />
    );
}
