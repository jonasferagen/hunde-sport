import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_RECENT } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';

import { useIsFocused } from '@react-navigation/native';

export const HomeScreen = React.memo(() => {

    const { to } = useCanonicalNav();
    const handleSearch = (q: string) => to('search', q);
    const isFocused = useIsFocused();

    return (isFocused &&
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody mode="scroll">
                <HomeContent />
            </PageBody>
        </PageView >
    );
});

const HomeContent = () => {
    return (
        <>
            <PageSection title="Nyheter" scrollable>
                <RecentProducts theme={THEME_PRODUCTS_RECENT} />
            </PageSection>
            <PageSection title="Kategorier" theme="dark_primary">
                <ProductCategoryTiles key="categories" />
            </PageSection>
            <PageSection title="Tilbud" scrollable>
                <DiscountedProducts key='discounted' theme={THEME_PRODUCTS_DISCOUNTED} />
            </PageSection>
            <PageSection title="Utvalgte produkter" scrollable theme="dark_primary">
                <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} />
            </PageSection>
            <PageSection title="Debug" scrollable >
                <DebugProducts key='debug' />
            </PageSection>
        </>
    );
}


// components/util/FocusGate.tsx

import React from 'react';

export function FocusGate({
    children,
    fallback = null,
}: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const isFocused = useIsFocused();
    return isFocused ? <>{children}</> : <>{fallback}</>;
}
