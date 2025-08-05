import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { JSX } from 'react';
import { ThemeName } from 'tamagui';
import { HorizontalTiles } from '../../ui/tile/HorizontalTiles';
import { ProductTile } from './ProductTile';

interface ProductListProps {
    theme?: ThemeName;
}

export const RecentProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const result = useRecentProducts();

    return <HorizontalTiles
        {...result}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const DiscountedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const result = useDiscountedProducts();

    return <HorizontalTiles
        {...result}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const FeaturedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const result = useFeaturedProducts();

    return <HorizontalTiles
        {...result}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};


export const RelatedProducts = ({ theme = 'primary', product }: { theme?: ThemeName; product: SimpleProduct | VariableProduct }): JSX.Element => {
    const result = useProductsByIds(product.related_ids);
    return <HorizontalTiles
        {...result}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const DebugProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const result = useProductsByIds([246557, 35961, 27445]);

    return <HorizontalTiles
        {...result}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};
