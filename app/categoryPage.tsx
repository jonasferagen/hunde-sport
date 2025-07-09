import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Breadcrumbs from './components/Breadcrumbs';
import CategoryList from './components/category/CategoryList';
import FullScreenLoader from './components/FullScreenLoader';
import ProductList from './components/product/ProductList';
import RetryView from './components/RetryView';
import { useCategories } from './contexts/CategoryContext';
import { useProducts } from './contexts/ProductContext';

const CategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const numericId = Number(id);

  // Fetch both sub-categories and products for the current category ID
  const { categories, loading: categoriesLoading, loadMore: loadMoreCategories, loadingMore: loadingMoreCategories, error: categoriesError, refresh: refreshCategories, setParentId, breadcrumbs } = useCategories(numericId);
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts, loadMore: loadMoreProducts, loadingMore: loadingMoreProducts, setActiveCategoryId } = useProducts(numericId);

  useEffect(() => {
    if (!isNaN(numericId)) {
      // Set the active ID for both contexts
      setParentId(numericId, name);
      setActiveCategoryId(numericId);
    }
  }, [numericId, name, setParentId, setActiveCategoryId]);

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

  // If there are sub-categories, show them. Otherwise, show products.
  const hasSubCategories = categories.length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs trail={breadcrumbs} onNavigate={(parentId) => setParentId(parentId)} />
      <Text style={styles.title}>{name}</Text>
      {
        hasSubCategories ? (
          <CategoryList categories={categories} loadMore={loadMoreCategories} loadingMore={loadingMoreCategories} />
        ) : (
          <ProductList products={products} loadMore={loadMoreProducts} loadingMore={loadingMoreProducts} />
        )
      }
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
