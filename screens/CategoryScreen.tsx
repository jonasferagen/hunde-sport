import { CategoryList } from '@/components/features/category/CategoryList';
import CategoryProducts from '@/components/features/product/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const CategoryScreen = memo(() => {
    const { id, name, image: imageString } = useLocalSearchParams<{ id: string; name: string, image?: string }>();
    const categoryId = Number(id);
    const image = imageString ? JSON.parse(imageString) : undefined;
    const { setTrail } = useBreadcrumbs();

    useEffect(() => {
        setTrail([
            {
                id: categoryId,
                name: name,
                type: 'category' as const,
                image: image,
            },
        ]);
    }, [categoryId, name, image, setTrail]);

    return (
        <PageView>
            <Stack.Screen options={{ title: name }} />
            <PageContent>
                <Breadcrumbs />
                <PageSection key={`products-${categoryId}`}>
                    <View style={styles.headingContainer}>
                        <Heading title={name} size="lg" />
                    </View>
                    <CategoryList categoryId={categoryId} limit={3} />
                </PageSection>
                <PageSection key={`categories-${categoryId}`}>
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({
    headingContainer: {},
});

export default CategoryScreen;
