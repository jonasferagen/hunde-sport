import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { routes } from '@/config/routes';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { Input } from 'tamagui';

export const HomeScreen = () => {

    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };


    const searchInputRef = useRunOnFocus<Input>((input) => input.focus());

    return (
        <PageView>
            <PageHeader >
                <SearchBar initialQuery="" ref={searchInputRef} onSubmit={handleSearch} />
            </PageHeader>

            <PageSection scrollable>
                <PageContent theme="soft" title="Kategorier" >
                    <ProductCategoryTiles key="categories" theme="alt1" />
                </PageContent>
                <PageContent theme="elevated" title="Nyheter" scrollable px="none" >
                    <RecentProducts key='recent' />
                </PageContent>
                <PageContent theme="soft" title="Tilbud" scrollable px="none" >
                    <DiscountedProducts key='discounted' />
                </PageContent>
                <PageContent theme="elevated" title="Utvalgte produkter" scrollable px="none">
                    <FeaturedProducts key='featured' />
                </PageContent>
                <PageContent theme="soft" title="Debug" scrollable px="none">
                    <DebugProducts key='debug' />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
