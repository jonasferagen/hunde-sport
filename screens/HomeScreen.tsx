import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { routes } from '@/config/routes';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router } from 'expo-router';
import { Input, Theme } from 'tamagui';

export const HomeScreen = () => {

    const handleSearch = (query: string) => {
        query && router.push(routes.search.path(query));
    };

    const searchInputRef = useRunOnFocus<Input>((input) => input.focus());

    return (
        <Theme name="primary">
            <PageView>
                <PageHeader >
                    <SearchBar initialQuery="" ref={searchInputRef} onSubmit={handleSearch} />
                </PageHeader>
                <PageSection scrollable>
                    <PageContent theme="soft" title="Kategorier">
                        <ProductCategoryTiles key="categories" theme="dark_success_alt1" />
                    </PageContent>
                    <PageContent theme="elevated" title="Nyheter" px="none" scrollable >
                        <RecentProducts key='recent' />
                    </PageContent>
                    <PageContent theme="soft" title="Tilbud" px="none" scrollable>
                        <DiscountedProducts key='discounted' />
                    </PageContent>
                    <PageContent theme="elevated" title="Utvalgte produkter" px="none" scrollable>
                        <FeaturedProducts key='featured' />
                    </PageContent>
                    <PageContent theme="soft" title="Debug" px="none" scrollable>
                        <DebugProducts key='debug' />
                    </PageContent>
                </PageSection>
            </PageView>
        </Theme>
    );
}
