import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/list/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { routes } from '@/config/routes';
import { router } from 'expo-router';

export const HomeScreen = () => {

    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };

    return (
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody>
                <PageSection title="Nyheter" scrollable>
                    <RecentProducts />
                </PageSection>
                <PageSection title="Kategorier" theme="dark_primary">
                    <ProductCategoryTiles key="categories" theme="tertiary" />
                </PageSection>
                <PageSection title="Tilbud" scrollable>
                    <DiscountedProducts key='discounted' />
                </PageSection>
                <PageSection title="Utvalgte produkter" scrollable theme="dark_primary">
                    <FeaturedProducts key='featured' />
                </PageSection>
                <PageSection title="Debug" scrollable >
                    <DebugProducts key='debug' />
                </PageSection>
            </PageBody>

        </PageView>
    );
}
