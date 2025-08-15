import { ProductCategoryTiles } from '@/components/features/product-category/ProductCategoryTiles';
import { DebugProducts, DiscountedProducts, FeaturedProducts, RecentProducts } from '@/components/features/product/ProductTiles';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { routes } from '@/config/routes';
import { useToastController } from '@tamagui/toast';
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
                <TestToastButton />
                <PageSection title="Nyheter" scrollable px="none"  >
                    <RecentProducts key='recent' />
                </PageSection>
                <PageSection title="Kategorier" theme="dark_primary">
                    <ProductCategoryTiles key="categories" theme="tertiary" />
                </PageSection>

                <PageSection title="Tilbud" scrollable px="none" >
                    <DiscountedProducts key='discounted' />
                </PageSection>
                <PageSection title="Utvalgte produkter" scrollable px="none" theme="dark_primary">
                    <FeaturedProducts key='featured' />
                </PageSection>
                <PageSection title="Debug" scrollable px="none">
                    <DebugProducts key='debug' />
                </PageSection>
            </PageBody>
        </PageView>

    );
}
const TestToastButton = () => {
    const toast = useToastController();
    return (
        <ThemedButton onPress={() => toast.show('Test', { message: 'Hello' })}>
            Show test toast
        </ThemedButton>
    );
};