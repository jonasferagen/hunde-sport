import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { BaseTile } from '@/components/ui/tile/BaseTile';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/data/Category';
import { useDiscountedProducts, useFeaturedProducts, useProductsByIds, useRecentProducts } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import { TextInput } from 'react-native';
import { XStack } from 'tamagui';

const CategorySection = () => {
    const { items: categories, isLoading } = useCategories(0);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    return (
        <XStack flexWrap="wrap" gap={SPACING.md} jc="space-between">
            {categories.map((category) => (
                <BaseTile
                    key={category.id.toString()}
                    href={routes.category(category)}
                    name={category.name}
                    imageUrl={category.image?.src ?? ''}
                    aspectRatio={1}
                    flexBasis="30%"
                    flexGrow={1}
                    themeVariant={'primary'}
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

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection scrollable>
                <PageContent>
                    <ProductTiles queryResult={debugProducts} themeVariant="secondary" />
                </PageContent>
                <PageContent secondary horizontal title="Nyheter">
                    <ProductTiles queryResult={recentProducts} themeVariant="accent" />
                </PageContent>
                <PageContent primary horizontal title="Tilbud">
                    <ProductTiles queryResult={discountedProducts} themeVariant="secondary" />
                </PageContent>
                <PageContent title="Kategorier">
                    <CategorySection />
                </PageContent>
                <PageContent primary horizontal title="Populære produkter" >
                    <ProductTiles queryResult={featuredProducts} themeVariant="secondary" />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
