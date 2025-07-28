import { DebugSeeder } from '@/components/development/DebugSeeder';
import { CategoryTiles } from '@/components/features/category/CategoryTiles';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';

import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/data/Category';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { TextInput } from 'react-native';

export const HomeScreen = () => {

    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const handleSearch = (query: string) => {
        query && router.push(routes.search(query));
    };
    const debugProducts = useProductsByIds([247691, 35961, 27445]);
    const recentProducts = useRecentProducts();
    const discountedProducts = useDiscountedProducts();
    const featuredProducts = useFeaturedProducts();
    const categories = useCategories(0, { autoload: true });

    return (

        <PageView>
            <PageHeader>
                <SearchBar initialQuery="" ref={searchInputRef} onSubmit={handleSearch} />
            </PageHeader>
            <PageSection scrollable>
                <PageContent theme="secondary" title="Debug">
                    <DebugSeeder />
                    <ProductTiles key='debug' queryResult={debugProducts} theme="primary" />
                </PageContent>
                <PageContent title="Kategorier">
                    <CategoryTiles key='categories' queryResult={categories} theme="primary" />
                </PageContent>
                <PageContent theme="secondary" title="Nyheter">
                    <ProductTiles key='recent' queryResult={recentProducts} theme="tertiary" />
                </PageContent>
                <PageContent theme="primary" title="Tilbud">
                    <ProductTiles key='discounted' queryResult={discountedProducts} theme="secondary" />
                </PageContent>
                <PageContent theme="primary" title="Populære produkter" >
                    <ProductTiles key='featured' queryResult={featuredProducts} theme="secondary" />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
