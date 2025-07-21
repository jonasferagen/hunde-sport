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
        return <Loader size="large" flex />;
    }

    const chunk = (arr: any[], size: number) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const chunkedCategories = chunk(categories, 3);

    return (
        <View style={styles.gridContainer}>
            {chunkedCategories.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((item) => (
                        <CategoryTile
                            key={item.id.toString()}
                            category={item}
                            style={styles.tile}
                            aspectRatio={1}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        gap: SPACING.md,
    },
    row: {
        gap: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    tile: {
        flex: 1,
        width: '30%',
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
                <PageContent title="Kategorier">
                    <CategorySection />
                </PageContent>
                <PageContent primary horizontal title="Populære produkter" >
                    <ProductTiles type="featured" themeVariant="secondary" />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
