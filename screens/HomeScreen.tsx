import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductRail';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { THEME_CATEGORIES, THEME_CATEGORIES_BG, THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_DISCOUNTED_BG, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_FEATURED_BG, THEME_PRODUCTS_RECENT, THEME_PRODUCTS_RECENT_BG } from '@/config/app';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { useScreenReady } from '@/hooks/useScreenReady';
import React from 'react';


export const HomeScreen = React.memo(() => {

    const ready = useScreenReady();
    const { to } = useCanonicalNavigation();
    const handleSearch = (q: string) => {
        const text = q.trim();
        if (!text) { to('search'); return; }    // open search screen empty
        to('search', text);
    };

    if (!ready) {
        return null;
    }

    return (
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody mode="scroll">
                <PageSection title="Nyheter" theme={THEME_PRODUCTS_RECENT_BG}>
                    <RecentProducts key="recent" theme={THEME_PRODUCTS_RECENT} />
                </PageSection>
                <PageSection title="Kategorier" theme={THEME_CATEGORIES_BG}>
                    <ProductCategoryTiles key="categories" theme={THEME_CATEGORIES} />
                </PageSection>
                <PageSection title="Tilbud" theme={THEME_PRODUCTS_DISCOUNTED_BG} >
                    <DiscountedProducts theme={THEME_PRODUCTS_DISCOUNTED} />
                </PageSection>
                <PageSection title="Utvalgte produkter" theme={THEME_PRODUCTS_FEATURED_BG}>
                    <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} />
                </PageSection>
                <PageSection title="Debug"  >
                    <DebugProducts key='debug' />
                </PageSection>
            </PageBody>
        </PageView >
    )
});

