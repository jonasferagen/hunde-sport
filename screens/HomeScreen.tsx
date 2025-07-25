import { CategoryTiles } from '@/components/features/category/CategoryTiles';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';

import { CategoryTile } from '@/components/features/category/CategoryTile';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/data/Category';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router, Stack } from 'expo-router';
import { TextInput } from 'react-native';
import { XStack } from 'tamagui';

const CategorySection = () => {
    const { items: categories, isLoading } = useCategories(0, { autoload: true });

    if (isLoading) {
        return <ThemedSpinner ai="center" jc="center" size="large" />;
    }
    return (
        <XStack flexWrap="wrap" gap="$4" jc="space-between">
            {categories.map((category) => (
                <CategoryTile
                    key={category.id.toString()}
                    category={category}
                    style={{
                        aspectRatio: 1,
                        flexBasis: '30%',
                        flexGrow: 1,
                    }}
                    theme={'primary'}
                />
            ))}
        </XStack>
    );
};

export const HomeScreen = () => {
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(routes.search(query));
        }
    };
    const debugProducts = useProductsByIds([35961, 27445]);
    const recentProducts = useRecentProducts();
    const discountedProducts = useDiscountedProducts();
    const featuredProducts = useFeaturedProducts();
    const categories = useCategories(0, { autoload: true });

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection scrollable>
                <PageContent title="Kategorier">
                    <CategoryTiles key='categories' queryResult={categories} theme="primary" />
                </PageContent>
                <PageContent title="Debug">
                    <ProductTiles key='debug' queryResult={debugProducts} theme="secondary" />
                </PageContent>
                <PageContent theme="secondary" title="Nyheter">
                    <ProductTiles key='recent' queryResult={recentProducts} theme="accent" />
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
