import { CategoryIcon } from '@/components/features/category/CategoryIcon';
import { CategoryList } from '@/components/features/category/CategoryList';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading, Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategory } from '@/hooks/Category/Category';
import { SPACING } from '@/styles/Dimensions';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const CategoryScreen = memo(() => {
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { data, isLoading } = useCategory(id);

    if (isLoading) {
        return <Loader />;
    }
    const category = data!;

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: category.name }} />
                <Breadcrumbs />
                <PageSection primary key={`products-${category.id}`}>
                    <View style={styles.headingContainer}>
                        <CategoryIcon image={category.image} size={24} color="black" />
                        <Heading title={category.name} size="lg" style={{ marginLeft: SPACING.sm }} />
                    </View>
                    <CategoryList categoryId={category.id} limit={4} style={styles.listContainer} />
                </PageSection>
                <PageSection key={`categories-${category.id}`} style={{ flex: 1 }} scrollable>
                    <CategoryProducts category={category} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({

    headingContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    listContainer: {
        marginTop: SPACING.md,
    },

});

export default CategoryScreen;
