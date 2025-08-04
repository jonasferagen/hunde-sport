
import { CategoryTiles } from '@/components/features/category/CategoryTiles';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';

import { SearchBar } from '@/components/ui/search-bar/Searchbar';
import { routes } from '@/config/routes';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { TextInput } from 'react-native';

export const HomeScreen = () => {

    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };
    const debugProducts = useProductsByIds([246557, 35961, 27445]);
    const recentProducts = useRecentProducts();
    const discountedProducts = useDiscountedProducts();
    const featuredProducts = useFeaturedProducts();

    return <PageView>
        <PageHeader theme="primary">
            <SearchBar initialQuery="" ref={searchInputRef} onSubmit={handleSearch} />
        </PageHeader>
        <PageSection scrollable>
            <PageContent theme="light_soft" title="Nyheter" px="none" scrollable >
                <ProductTiles key='recent' queryResult={recentProducts} theme="primary" />
            </PageContent>
            <PageContent theme="secondary_soft" title="Kategorier">
                <CategoryTiles key="categories" theme="tertiary_alt1" />
            </PageContent>
            <PageContent theme="primary_soft" title="Tilbud" px="none" scrollable>
                <ProductTiles key='discounted' queryResult={discountedProducts} theme="light" />
            </PageContent>
            <PageContent theme="tertiary_soft" title="Populære produkter" px="none" scrollable>
                <ProductTiles key='featured' queryResult={featuredProducts} theme="tertiary" />
            </PageContent>
            <PageContent theme="light" title="Debug" px="none" scrollable>
                <ProductTiles key='debug' queryResult={debugProducts} theme="secondary" />
            </PageContent>
        </PageSection>
    </PageView>
}

