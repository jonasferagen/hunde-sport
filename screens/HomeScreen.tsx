import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { Defer } from '@/components/ui/Defer';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { THEME_PRODUCTS_DISCOUNTED, THEME_PRODUCTS_FEATURED, THEME_PRODUCTS_RECENT } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import React from 'react';


export const HomeScreen = React.memo(() => {

    const { to } = useCanonicalNav();
    const handleSearch = (q: string) => to('search', q);

    return (
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody mode="scroll">
                <PageSection title="Nyheter" scrollable>
                    <Defer minDelay={1000} once>
                        <RecentProducts theme={THEME_PRODUCTS_RECENT} />
                    </Defer>
                </PageSection>
                <PageSection title="Kategorier" theme="dark_primary">
                    <Defer minDelay={60} once>
                        <ProductCategoryTiles key="categories" />
                    </Defer>
                </PageSection>
                <PageSection title="Tilbud" scrollable>
                    <Defer minDelay={60} once>
                        <DiscountedProducts key='discounted' theme={THEME_PRODUCTS_DISCOUNTED} />
                    </Defer>
                </PageSection>
                <PageSection title="Utvalgte produkter" scrollable theme="dark_primary">
                    <Defer minDelay={60} once>
                        <FeaturedProducts key='featured' theme={THEME_PRODUCTS_FEATURED} />
                    </Defer>
                </PageSection>
                <PageSection title="Debug" scrollable >
                    <Defer minDelay={60} once>
                        <DebugProducts key='debug' />
                    </Defer>
                </PageSection>

            </PageBody>
        </PageView >
    )
});

