import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Breadcrumbs from './components/Breadcrumbs';
import CategoryList from './components/category/CategoryList';
import FullScreenLoader from './components/FullScreenLoader';
import ProductList from './components/product/ProductList';
import RetryView from './components/RetryView';
import { useBreadcrumbs } from './contexts/BreadcrumbContext/BreadcrumbProvider';
import { useProductCategories } from './contexts/ProductCategory';
import { useProducts } from './contexts/ProductContext/ProductProvider';

const CategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const categoryId = Number(id);

  // Fetch both sub-categories and products for the current category ID
  const { categories, loading: categoriesLoading, loadMore: loadMoreCategories, loadingMore: loadingMoreCategories, error: categoriesError, refresh: refreshCategories, setCategoryId } = useProductCategories(categoryId);
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts, loadMore: loadMoreProducts, loadingMore: loadingMoreProducts } = useProducts(categoryId);
  const { breadcrumbs, setTrail } = useBreadcrumbs();


  useEffect(() => {
    // Set the active ID for both contexts
    setCategoryId(categoryId);
    // Update the breadcrumb trail with the current category
    setTrail({ id: categoryId, name, type: 'category' });

  }, [categoryId, name, setCategoryId]);

  const isLoading = categoriesLoading || productsLoading;
  const hasData = categories.length > 0 || products.length > 0;

  // Show a single loader until we have some data to display
  if (isLoading && !hasData) {
    return <FullScreenLoader />;
  }

  // Handle errors from either context
  const error = categoriesError || productsError;
  const refresh = categoriesError ? refreshCategories : refreshProducts;
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
          router.push({ pathname: '/categoryPage', params: { id: crumb.id.toString(), name: crumb.name } });
        }
      }} />
      <Text style={styles.title}>{name}</Text>
      <CategoryList categories={categories} loadMore={loadMoreCategories} loadingMore={loadingMoreCategories} />
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

export default CategoryPage;
