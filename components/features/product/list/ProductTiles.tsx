import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { PurchasableProduct } from '@/types';
import { JSX } from 'react';
import { StackProps } from 'tamagui';
import { HorizontalTiles } from '../../../ui/tile/HorizontalTiles';
import { ProductTile } from './ProductTile';


export const RecentProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useRecentProducts()} {...props} />
};

export const DiscountedProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useDiscountedProducts()} {...props} />
};

export const FeaturedProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useFeaturedProducts()} {...props} />
};

export const DebugProducts = (props: StackProps): JSX.Element => {
    return <ProductTiles queryResult={useProductsByIds([246557, 35961, 27445])} {...props} />
};



interface ProductTilesProps extends StackProps {
    queryResult: QueryResult<PurchasableProduct>;
}

const ProductTiles: React.FC<ProductTilesProps> = ({ queryResult, ...stackProps }: ProductTilesProps) => {
    return (

        <HorizontalTiles
            {...queryResult}
            {...stackProps}
            renderItem={({ item: product }: { item: PurchasableProduct }) => {
                return (
                    <PurchasableProviderInit product={product}>
                        <ProductTile />
                    </PurchasableProviderInit>
                );
            }}
        />

    );
};
