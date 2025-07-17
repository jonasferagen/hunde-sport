import { useTheme } from '@/contexts';
import type { Category } from '@/types';
import { BaseTile, type BaseTileProps } from '../../ui/tile/BaseTile';

interface CategoryTileProps extends Omit<BaseTileProps, 'name' | 'imageUrl' | 'topRightText'> {
    category: Category;
}

export const CategoryTile = ({ category, ...rest }: CategoryTileProps) => {
    const { themeManager } = useTheme();

    if (!category.image) {
        return null;
    }

    const themeVariant = themeManager.getVariant('primary');

    return (
        <BaseTile
            name={category.name}
            imageUrl={category.image.src}
            mainColor={themeVariant.backgroundColor}
            {...rest}
        />
    );
}
