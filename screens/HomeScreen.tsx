import { CategoryTile } from '@/components/features/category/CategoryTile';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader, ProductTile } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useProduct } from '@/hooks';
import { useCategories } from '@/hooks/Category';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const CategorySection = () => {
    const { categories, isLoading } = useCategories(0);

    if (isLoading) {
        return <Loader size='large' flex />;
    }

    return (
        <View style={styles.categoryContainer}>
            {categories.map((item) => (
                <CategoryTile
                    key={item.id.toString()}
                    category={item}
                    style={styles.categoryTile}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: SPACING.md,
        borderColor: 'red',
        borderWidth: 1,
        gap: SPACING.sm,

    },
    categoryTile: {
        width: '32%',
        height: 100,
        marginBottom: SPACING.sm,
    },
});

/* 
               <PageContent accent horizontal title="Populære produkter">
                    <ProductTiles type="featured" themeVariant="secondary" />
                </PageContent> */

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
            <PageSection scrollable>
                {false && product && <ProductTile product={product!} />}
                <PageContent secondary horizontal title="Nyheter">
                    <ProductTiles type="recent" themeVariant="accent" />
                </PageContent>
                <PageContent primary horizontal title="Tilbud">
                    <ProductTiles type="discounted" themeVariant="secondary" />
                </PageContent>
                <PageContent paddingHorizontal="none" title="Kategorier">
                    <CategorySection />
                </PageContent>
                <PageContent primary horizontal title="Populære produkter">
                    <ProductTiles type="featured" themeVariant="secondary" />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
