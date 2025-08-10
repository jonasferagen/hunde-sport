import { BaseProductProvider } from '@/contexts/BaseProductContext';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { PurchasableProduct } from '@/types';
import { JSX } from 'react';
import { HorizontalTiles } from '../../ui/tile/HorizontalTiles';
import { ProductTile } from './ProductTile';


export const RecentProducts = (): JSX.Element => {
    return <ProductTiles queryResult={useRecentProducts()} />
};

export const DiscountedProducts = (): JSX.Element => {
    return <ProductTiles queryResult={useDiscountedProducts()} />
};

export const FeaturedProducts = (): JSX.Element => {
    return <ProductTiles queryResult={useFeaturedProducts()} />
};

export const DebugProducts = (): JSX.Element => {
    return <ProductTiles queryResult={useProductsByIds([246557, 35961, 27445])} />
};



interface ProductTilesProps {
    queryResult: QueryResult<PurchasableProduct>;
}

const ProductTiles: React.FC<ProductTilesProps> = ({ queryResult }: ProductTilesProps) => {

    return <HorizontalTiles
        {...queryResult}
        renderItem={({ item }: { item: PurchasableProduct }) => {
            return (
                <BaseProductProvider product={item}>
                    <ProductTile />
                </BaseProductProvider>
            );
        }}
    />
};
