import CategoryList from '@/components/features/category/CategoryList';
import CategoryProducts from '@/components/features/product/CategoryProducts';
import { Heading, PageSection } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/BreadCrumb/BreadcrumbProvider';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import PageContent from "../components/ui/page/PageContent";
import PageView from "../components/ui/page/PageView";

const CategoryScreen = memo(() => {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const categoryId = Number(id);

    const { breadcrumbs, setTrail } = useBreadcrumbs();


    useFocusEffect(
        useCallback(() => {
            console.log("setting breadcrumbs for", { id: categoryId, name, type: 'category' });
            setTrail({ id: categoryId, name, type: 'category' });
        }, [categoryId, name, setTrail])
    );

    return (
        <PageView>
            <Stack.Screen options={{ title: name }} />
            { /*
            <Breadcrumbs trail={breadcrumbs} onNavigate={(crumb) => {
                if (crumb.id === null) {
                    router.replace('/');
                } else {
                    router.push({ pathname: './category', params: { id: crumb.id.toString(), name: crumb.name } });
                }
            }} />
             */
            }

            <PageSection key={`products-${categoryId}`}>
                <Heading title={name} size="lg" />
                <CategoryList categoryId={categoryId} />
            </PageSection>
            <PageContent scrollable>
                <PageSection key={`categories-${categoryId}`}>
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({});

export default CategoryScreen;
