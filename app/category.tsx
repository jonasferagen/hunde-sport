import Categories from '@/components/features/category/Categories';
import CategoryProducts from '@/components/features/category/CategoryProducts';
import { Breadcrumbs, Heading, PageSection } from '@/components/ui/_index';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PageContent from "../components/ui/PageContent";
import PageView from "../components/ui/PageView";

const CategoryScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const categoryId = Number(id);
  const { breadcrumbs, setTrail } = useBreadcrumbs();

  useEffect(() => {
    setTrail({ id: categoryId, name, type: 'category' });
  }, [categoryId, name, setTrail]);

  return (
    <PageView>
      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs trail={breadcrumbs} onNavigate={(crumb) => {
        setTrail(crumb);
        if (crumb.id === null) {
          router.replace('/');
        } else {
          router.push({ pathname: './category', params: { id: crumb.id.toString(), name: crumb.name } });
        }
      }} />
      <PageContent>
        <PageSection>
          <Heading title={name} size="lg" />
          <CategoryProducts categoryId={categoryId} />
        </PageSection>
        <PageSection>
          <Heading title="Underkategorier" size="md" />
          <Categories categoryId={categoryId} />
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
