import { CategoryCard } from '@/components/features/category/CategoryCard';
import { FeaturedProducts } from '@/components/features/product/FeaturedProducts';
import { ProductCard } from '@/components/features/product/ProductCard';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useProduct } from '@/hooks';
import { useCategories } from '@/hooks/Category';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import { FlatList, TextInput } from 'react-native';

const CategorySection = () => {
    const { categories, isLoading } = useCategories(0);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <FlatList
            data={categories}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CategoryCard
                    category={item}
                    style={{
                        flex: 1,
                        margin: SPACING.sm,
                    }}
                />
            )}
            contentContainerStyle={{
                paddingHorizontal: SPACING.sm,
            }}
        />
    );
}

export const HomeScreen = () => {
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(routes.search(query));
        }
    };

    const { data: product } = useProduct(35961);


    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection>
                <PageContent accent horizontal title="Populære produkter">
                    <FeaturedProducts />
                </PageContent>
            </PageSection>
            <PageSection >
                <PageContent paddingHorizontal="none">
                    {false && product && <ProductCard product={product!} />}
                    <CategorySection />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
