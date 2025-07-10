import Categories from '@/components/features/category/Categories';
import CategoryProducts from '@/components/features/category/CategoryProducts';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import PageView from "./_pageView";



const CategoryPage = () => {
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
      <Text style={styles.title}>{name}</Text>
      <CategoryProducts categoryId={categoryId} />
      <Categories categoryId={categoryId} />
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

export default CategoryPage;
