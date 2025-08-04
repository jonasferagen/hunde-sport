import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { InfiniteListQueryResult } from '@/hooks/data/util';
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
    const queryResult = useRecentProducts();

    return <HorizontalTiles
        queryResult={queryResult as InfiniteListQueryResult<SimpleProduct | VariableProduct>}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const DiscountedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const queryResult = useDiscountedProducts();

    return <HorizontalTiles
        queryResult={queryResult as InfiniteListQueryResult<SimpleProduct | VariableProduct>}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const FeaturedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const queryResult = useFeaturedProducts();

    return <HorizontalTiles
        queryResult={queryResult as InfiniteListQueryResult<SimpleProduct | VariableProduct>}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};

export const DebugProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    const queryResult = useProductsByIds([246557, 35961, 27445]);

    return <HorizontalTiles
        queryResult={queryResult as InfiniteListQueryResult<SimpleProduct | VariableProduct>}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};
