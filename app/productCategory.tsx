import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCategories from '@/components/ProductCategories';
import ProductsByCategory from '@/components/ProductsByCategory';
import { useBreadcrumbs } from '@/context/BreadcrumbContext/BreadcrumbProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const ProductCategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const productCategoryId = Number(id);
  const { breadcrumbs, setTrail } = useBreadcrumbs();


  useEffect(() => {
    setTrail({ id: productCategoryId, name, type: 'productCategory' });
  }, [productCategoryId, name, setTrail]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs trail={breadcrumbs} onNavigate={(crumb) => {
        setTrail(crumb);
        if (crumb.id === null) {
          router.replace('/');
        } else {
          router.push({ pathname: './productCategory', params: { id: crumb.id.toString(), name: crumb.name } });
        }
      }} />
      <Text style={styles.title}>{name}</Text>
      <ProductsByCategory productCategoryId={productCategoryId} />
      <ProductCategories productCategoryId={productCategoryId} />
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
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ProductCategoryPage;
