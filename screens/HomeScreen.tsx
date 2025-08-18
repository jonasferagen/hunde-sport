import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_RECENT } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useScreenReady } from '@/hooks/useScreenReady';
import React from 'react';
import { LoadingScreen } from './misc/LoadingScreen';


export const HomeScreen = React.memo(() => {

    const ready = useScreenReady();
    const { to } = useCanonicalNav();
    const handleSearch = (q: string) => {
        const text = q.trim();
        if (!text) { to('search'); return; }    // open search screen empty
        to('search', text);
    };

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

