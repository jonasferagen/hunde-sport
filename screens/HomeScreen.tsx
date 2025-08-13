import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/ProductTiles';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui/search-bar/Searchbar';
import { routes } from '@/config/routes';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { Input } from 'tamagui';

export const HomeScreen = () => {

    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };

    const searchInputRef = useRunOnFocus<Input>((input) => input.focus());
    //ref={searchInputRef}
    return (
        <PageView>
            <PageHeader >
                <SearchBar onSubmit={handleSearch} />
            </PageHeader>
            <PageBody scrollable>
                <PageSection title="Kategorier">
                    <ProductCategoryTiles key="categories" />
                </PageSection>
                <PageSection title="Nyheter" scrollable px="none" >
                    <RecentProducts key='recent' />
                </PageSection>
                <PageSection title="Tilbud" scrollable px="none" >
                    <DiscountedProducts key='discounted' />
                </PageSection>
                <PageSection title="Utvalgte produkter" scrollable px="none">
                    <FeaturedProducts key='featured' />
                </PageSection>
                <PageSection title="Debug" scrollable px="none">
                    <DebugProducts key='debug' />
                </PageSection>
            </PageBody>
        </PageView>

    );
}

