import Categories from '@/components/features/category/Categories';
import CategoryProducts from '@/components/features/category/CategoryProducts';
import { Heading, PageSection } from '@/components/ui';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
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
    console.log("category", { id: categoryId, name, type: 'category' });
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


            <PageContent scrollable>
                <PageSection key={`products-${categoryId}`}>
                    <Heading title={name} size="lg" />
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
                <PageSection key={`categories-${categoryId}`}>
                    <Categories categoryId={categoryId} title="Underkategorier" />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopColor: '#00f',
        borderTopWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    }
});

export default CategoryScreen;
