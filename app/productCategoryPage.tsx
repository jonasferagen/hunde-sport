import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProductCategories from './_productCategories';
import Products from './_products';
import Breadcrumbs from './components/Breadcrumbs';
import { useBreadcrumbs } from './contexts/BreadcrumbContext/BreadcrumbProvider';


const ProductCategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const productCategoryId = Number(id);
  const { breadcrumbs, setTrail } = useBreadcrumbs();

  /*
  useEffect(() => {
    if (categories.length > 0) {
      const testId = categories[0].id;
      getProductCategoryById(testId).then(categoryFromCache => {
        console.log(`[Test] Fetched category ${testId} from cache:`, categoryFromCache);
      });
    }
  }, [categories, getProductCategoryById]);
*/

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
          router.push({ pathname: '/productCategoryPage', params: { id: crumb.id.toString(), name: crumb.name } });
        }
      }} />
      <Text style={styles.title}>{name}</Text>
      <ProductCategories productCategoryId={productCategoryId} />
      <Products productCategoryId={productCategoryId} />
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
