import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Breadcrumbs from './components/Breadcrumbs';
import CategoryList from './components/category/CategoryList';
import FullScreenLoader from './components/FullScreenLoader';
import RetryView from './components/RetryView';
import { useCategories } from './contexts/CategoryContext';

const CategoryPage = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const numericId = Number(id);

  const { categories, loading, loadingMore, error, loadMore, refresh, setParentId, breadcrumbs } = useCategories(numericId);

  useEffect(() => {
    if (!isNaN(numericId)) {
      setParentId(numericId, name);
    }
  }, [numericId, name, setParentId]);

  // Show loader only when this specific category is loading and has no items yet.
  if (loading && categories.length === 0) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <RetryView error={error} onRetry={refresh} />;
  }

  return (
    <View>
      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs trail={breadcrumbs} onNavigate={(parentId) => setParentId(parentId)} />
      <Text style={styles.title}>{name}</Text>
      <CategoryList categories={categories} loadMore={loadMore} loadingMore={loadingMore} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default CategoryPage;
