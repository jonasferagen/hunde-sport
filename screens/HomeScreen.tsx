import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS, PRODUCT_TILE_HEIGHT, THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_RECENT } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useScreenReady } from '@/hooks/useScreenReady';
import { spacePx } from '@/lib/helpers';
import React from 'react';
import { Dimensions } from 'react-native';
import { LoadingScreen } from './misc/LoadingScreen';

const COLS = NUM_CATEGORY_TILE_COLUMNS; // e.g. 3
const ROWS = NUM_CATEGORY_TILE_ROWS;    // e.g. 3
const GAP_PX = spacePx('$3');
const PAD_PX = spacePx('$3');
const innerW = Dimensions.get('window').width - PAD_PX * 2;
const tileW = (innerW - GAP_PX * (COLS - 1)) / COLS;
const CATEGORY_GRID_H = Math.round(ROWS * tileW + GAP_PX * (ROWS - 1));

const HOME_TILE_ROW_H = (PRODUCT_TILE_HEIGHT as number) + PAD_PX * 2;

export const HomeScreen = React.memo(() => {


    const ready = useScreenReady();

    const { to } = useCanonicalNav();
    const handleSearch = (q: string) => to('search', q);

    if (!ready) {
        return <LoadingScreen />
    }

    return (
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody mode="scroll" >
                <PageSection title="Nyheter" bleedX  >
                    <RecentProducts key="recent" theme={THEME_PRODUCTS_RECENT} />
                </PageSection>
                <PageSection title="Kategorier" bleedX theme="dark_primary">
                    <ProductCategoryTiles key="categories" />
                </PageSection>
                <PageSection title="Tilbud" bleedX >
                    <DiscountedProducts theme={THEME_PRODUCTS_DISCOUNTED} />
                </PageSection>
                <PageSection title="Utvalgte produkter" bleedX theme="dark_primary">
                    <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} />
                </PageSection>
                <PageSection title="Debug" bleedX >
                    <DebugProducts key='debug' />
                </PageSection>
            </PageBody>
        </PageView >
    )
});

