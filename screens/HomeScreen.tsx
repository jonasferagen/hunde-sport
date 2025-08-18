import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS, THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_RECENT } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useScreenReady } from '@/hooks/useScreenReady';
import { spacePx } from '@/lib/helpers';
import React from 'react';
import { Dimensions } from 'react-native';

const COLS = NUM_CATEGORY_TILE_COLUMNS; // e.g. 3
const ROWS = NUM_CATEGORY_TILE_ROWS;    // e.g. 3
const GAP_PX = spacePx('$3');
const PAD_PX = spacePx('$3');
const innerW = Dimensions.get('window').width - PAD_PX * 2;
const tileW = (innerW - GAP_PX * (COLS - 1)) / COLS;
const CATEGORY_GRID_H = Math.round(ROWS * tileW + GAP_PX * (ROWS - 1));


export const HomeScreen = React.memo(() => {


    const uready = useScreenReady();
    const ready = false;

    const { to } = useCanonicalNav();
    const handleSearch = (q: string) => to('search', q);



    return (
        <PageView>
            <PageHeader >
                {true && <SearchBar onSubmit={handleSearch} />}
            </PageHeader>
            <PageBody mode="scroll" >
                <PageSection title="Nyheter" bleedX >
                    {ready &&
                        <RecentProducts theme={THEME_PRODUCTS_RECENT} />
                    }
                </PageSection>
                <PageSection title="Kategorier" theme="dark_primary" bleedX contentHeight={CATEGORY_GRID_H} >
                    {true && <ProductCategoryTiles key="categories" mx="$3" />}
                </PageSection>

                <PageSection title="Tilbud" bleedX >
                    {ready &&
                        <DiscountedProducts key='discounted' theme={THEME_PRODUCTS_DISCOUNTED} />
                    }
                </PageSection>
                <PageSection title="Utvalgte produkter" bleedX theme="dark_primary">
                    {ready &&
                        <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} />
                    }
                </PageSection>
                <PageSection title="Debug" bleedX >
                    {ready &&
                        <DebugProducts key='debug' />
                    }
                </PageSection>
            </PageBody>
        </PageView >
    )
});

