import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { Product } from '@/types';
import { JSX } from 'react';
import { ThemeName } from 'tamagui';
import { HorizontalTiles } from '../../ui/tile/HorizontalTiles';
import { ProductTile } from './ProductTile';

interface ProductListProps {
    theme?: ThemeName;
}

export const RecentProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    return <ProductTiles theme={theme} queryResult={useRecentProducts()} />
};

export const DiscountedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    return <ProductTiles theme={theme} queryResult={useDiscountedProducts()} />
};

export const FeaturedProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    return <ProductTiles theme={theme} queryResult={useFeaturedProducts()} />
};

export const DebugProducts = ({ theme = 'primary' }: ProductListProps): JSX.Element => {
    return <ProductTiles theme={theme} queryResult={useProductsByIds([246557, 35961, 27445])} />
};




interface ProductTilesProps {
    theme?: ThemeName;
    queryResult: QueryResult<Product>;
}

const ProductTiles: React.FC<ProductTilesProps> = ({ theme = 'primary', queryResult }: ProductTilesProps) => {

    return <HorizontalTiles
        {...queryResult}
        renderItem={({ item }: { item: Product }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />
};
