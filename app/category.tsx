import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Categories from '@/components/features/category/Categories';
import CategoryProducts from '@/components/features/category/CategoryProducts';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const categoryId = Number(id);
  const { breadcrumbs, setTrail } = useBreadcrumbs();

  useEffect(() => {
    setTrail({ id: categoryId, name, type: 'category' });
  }, [categoryId, name, setTrail]);


  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  }
});

export default CategoryPage;
