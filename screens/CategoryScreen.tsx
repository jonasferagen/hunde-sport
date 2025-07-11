import CategoryProducts from '@/components/features/category/CategoryProducts';
import { Breadcrumbs, Heading, PageSection } from '@/components/ui';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { useCategory } from '@/context/Category/Category';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PageContent from "../components/ui/page/PageContent";
import PageView from "../components/ui/page/PageView";

const CategoryScreen = () => {
    const { id } = useLocalSearchParams<{ id: string; name: string }>();
    const categoryId = Number(id);
    const { breadcrumbs, setTrail, setFullTrail } = useBreadcrumbs();
    const { data: category, isLoading } = useCategory(categoryId);

    useEffect(() => {
        if (category) {
            const trail = [{ id: category.id, name: category.name, type: 'category' as const }];
            setFullTrail(trail);
        }
    }, [category, setFullTrail]);

    if (isLoading || !category) {
        return null; // Or a loading indicator
    }

    return (
        <PageView>
            <Stack.Screen options={{ title: category.name }} />
            <Breadcrumbs trail={breadcrumbs} onNavigate={(crumb) => {
                setTrail(crumb);
                if (crumb.id === null) {
                    router.replace('/');
                } else {
                    router.push({ pathname: './category', params: { id: crumb.id.toString(), name: crumb.name } });
                }
            }} />
            <PageContent scrollable>
                <PageSection>
                    <Heading title={category.name} size="lg" />
                    <CategoryProducts categoryId={categoryId} />
                </PageSection>
                <PageSection>
                    <Heading title="Underkategorier" size="lg" />
                    { /*
                    <Categories categoryId={categoryId} title="Underkategorier" />
                    */
                    }
                </PageSection>
            </PageContent>
        </PageView>
    );
};

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
