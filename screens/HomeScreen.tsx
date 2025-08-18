import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { Defer } from '@/components/ui/Defer';
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
                {<SearchBar onSubmit={handleSearch} />}
            </PageHeader>
            <PageBody mode="scroll" >
                <PageSection title="Nyheter" bleedX >
                    <Defer minDelay={50} once >
                        <RecentProducts key="recent" theme={THEME_PRODUCTS_RECENT} h={PRODUCT_TILE_HEIGHT} boc="red" bw={1} />
                    </Defer>
                </PageSection>
                <PageSection title="Kategorier" theme="dark_primary" bleedX contentHeight={CATEGORY_GRID_H} >
                    <ProductCategoryTiles key="categories" mx="$3" />
                </PageSection>
                <PageSection title="Tilbud" bleedX >
                    <Defer minDelay={100} once>
                        <DiscountedProducts theme={THEME_PRODUCTS_DISCOUNTED} h={PRODUCT_TILE_HEIGHT} boc="red" bw={1} />
                    </Defer>
                </PageSection>
                <PageSection title="Utvalgte produkter" bleedX theme="dark_primary">
                    <Defer minDelay={200} once>
                        <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} h={PRODUCT_TILE_HEIGHT} boc="red" bw={1} />
                    </Defer>
                </PageSection>
                <PageSection title="Debug" bleedX >
                    <Defer minDelay={300} once>
                        <DebugProducts key='debug' h={PRODUCT_TILE_HEIGHT} boc="red" bw={1} />
                    </Defer>
                </PageSection>
            </PageBody>
        </PageView >
    )
});

