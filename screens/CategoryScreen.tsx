import CategoryList from '@/components/features/category/CategoryList';
import CategoryProducts from '@/components/features/product/CategoryProducts';
import { Breadcrumbs, Heading, PageSection } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/BreadCrumb/BreadcrumbProvider';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import PageContent from "../components/ui/page/PageContent";
import PageView from "../components/ui/page/PageView";

const CategoryScreen = memo(() => {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const categoryId = Number(id);

    const { breadcrumbs } = useBreadcrumbs();

    return (
        <PageView>
            <Stack.Screen options={{ title: name }} />
            <PageContent>
                <Breadcrumbs trail={breadcrumbs} onNavigate={(crumb) => {
                    if (crumb.id === null) {
                        router.replace('/');
                    } else {
                        router.push({ pathname: '(drawer)/category', params: { id: crumb.id.toString(), name: crumb.name } });
                    }
                }} />

                <PageSection key={`products-${categoryId}`}>
                    <Heading title={name} size="lg" />
                    <CategoryList categoryId={categoryId} limit={3} />
                </PageSection>
                <PageSection key={`categories-${categoryId}`}>
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({});

export default CategoryScreen;
