import { CategoryIcon } from '@/components/features/category/CategoryIcon';
import { CategoryList } from '@/components/features/category/CategoryList';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { SPACING } from '@/styles/Dimensions';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const CategoryScreen = memo(() => {
    const { id, name, image: imageString } = useLocalSearchParams<{ id: string; name: string, image?: string }>();
    const categoryId = Number(id);
    const image = imageString ? JSON.parse(imageString) : undefined;

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: name }} />
                <Breadcrumbs />
                <PageSection style={{ justifyContent: 'flex-start' }} key={`products-${categoryId}`}>
                    <View style={styles.headingContainer}>
                        <CategoryIcon image={image} size={24} style={styles.icon} />
                        <Heading title={name} size="lg" />
                    </View>
                    <CategoryList categoryId={categoryId} limit={4} />
                </PageSection>
                <PageSection key={`categories-${categoryId}`} style={{ flex: 1 }} scrollable>
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({
    headingContainer: {
        width: '100%',
        flexDirection: 'row',


        marginBottom: SPACING.md,
    },
    icon: {
        marginRight: SPACING.sm,
    },
});

export default CategoryScreen;
