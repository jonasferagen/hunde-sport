import { CategoryTile } from '@/components/features/category/CategoryTile';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/Category';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import React from 'react';
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
                <CategoryTile
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

    //   const { data: product } = useProduct(35961);
    //    {false && product && <ProductTile product={product!} />}

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection scrollable>
                <PageContent accent horizontal title="Populære produkter">
                    <ProductTiles type="featured" themeVariant="secondary" />
                </PageContent>
                <PageContent secondary horizontal title="Nyheter">
                    <ProductTiles type="recent" themeVariant="primary" />
                </PageContent>
                <PageContent primary horizontal title="Tilbud">
                    <ProductTiles type="discounted" themeVariant="accent" />
                </PageContent>
                <PageContent paddingHorizontal="none" title="Kategorier">
                    <CategorySection />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
