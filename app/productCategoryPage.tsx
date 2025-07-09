import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProductCategories from './_productCategories';
import Breadcrumbs from './components/Breadcrumbs';
import FullScreenLoader from './components/FullScreenLoader';
import ProductList from './components/product/ProductList';
import RetryView from './components/RetryView';
import { useBreadcrumbs } from './contexts/BreadcrumbContext/BreadcrumbProvider';
import useProductCategories from './contexts/ProductCategory';
import { useProducts } from './contexts/ProductContext/ProductProvider';


const ProductCategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const productCategoryId = Number(id);

  const { setProductCategoryId } = useProductCategories(productCategoryId);
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts, loadMore: loadMoreProducts, loadingMore: loadingMoreProducts } = useProducts(productCategoryId);
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
    // Set the active ID for both contexts
    setProductCategoryId(productCategoryId);
    // Update the breadcrumb trail with the current category
    setTrail({ id: productCategoryId, name, type: 'category' });

  }, [productCategoryId, name, setProductCategoryId, setTrail]);

  const isLoading = productsLoading;
  const hasData = products.length > 0;

  if (isLoading && !hasData) {
    return <FullScreenLoader />;
  }

  const error = productsError;
  const refresh = refreshProducts;
  if (error) {
    return <RetryView error={error} onRetry={refresh} />;
  }

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
      <ProductList products={products} loadMore={loadMoreProducts} loadingMore={loadingMoreProducts} />
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
