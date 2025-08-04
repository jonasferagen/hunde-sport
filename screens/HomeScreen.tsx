import { ProductCategoryTiles } from '@/components/features/category/CategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { routes } from '@/config/routes';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { TextInput } from 'react-native';

export const HomeScreen = () => {

    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };

    return <PageView>
        <PageHeader theme="primary">
            <SearchBar initialQuery="" ref={searchInputRef} onSubmit={handleSearch} />
        </PageHeader>
        <PageSection scrollable>
            <PageContent theme="light_soft" title="Nyheter" px="none" scrollable >
                <RecentProducts key='recent' theme="primary" />
            </PageContent>
            <PageContent theme="secondary_soft" title="Kategorier">
                <ProductCategoryTiles key="categories" theme="tertiary_alt1" />
            </PageContent>
            <PageContent theme="primary_soft" title="Tilbud" px="none" scrollable>
                <DiscountedProducts key='discounted' theme="light" />
            </PageContent>
            <PageContent theme="tertiary" title="Utvalgte produkter" px="none" scrollable>
                <FeaturedProducts key='featured' theme="light" />
            </PageContent>
            <PageContent theme="light" title="Debug" px="none" scrollable>
                <DebugProducts key='debug' theme="secondary" />
            </PageContent>
        </PageSection>
    </PageView >
}
