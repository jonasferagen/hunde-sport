import { CategoryTile } from '@/components/features/category/CategoryTile';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/data/Category';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { XStack } from 'tamagui';

const CategorySection = () => {
    const { items: categories, isLoading } = useCategories(0);

    console.log(isLoading, categories.length);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    return (
        <XStack flexWrap="wrap" gap={SPACING.md} jc="space-between">
            {categories.map((item) => (
                <CategoryTile
                    key={item.id.toString()}
                    category={item}
                    aspectRatio={1}
                    flexBasis="30%"
                    flexGrow={1}
                />
            ))}
        </XStack>
    );
};

const styles = StyleSheet.create({});

export const HomeScreen = () => {
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(routes.search(query));
        }
    };

    const debugIds = [35961, 27445];

    const recentProducts = useProductsByIds(debugIds);
    const discountedProducts = useDiscountedProducts();
    const featuredProducts = useFeaturedProducts();
    const debugProducts = useProductsByIds(debugIds);

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection scrollable>
                <PageContent style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <ProductTiles querybuilder={debugProducts} themeVariant="secondary" />
                </PageContent>
                <PageContent secondary horizontal title="Nyheter">
                    <ProductTiles querybuilder={recentProducts} themeVariant="accent" />
                </PageContent>
                <PageContent primary horizontal title="Tilbud">
                    <ProductTiles querybuilder={discountedProducts} themeVariant="secondary" />
                </PageContent>
                <PageContent title="Kategorier">
                    <CategorySection />
                </PageContent>
                <PageContent primary horizontal title="Populære produkter" >
                    <ProductTiles querybuilder={featuredProducts} themeVariant="secondary" />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
