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
  const { categories, loading, loadingMore, error, loadMore, refresh, setParentId, breadcrumbs } = useCategories();

  useEffect(() => {
    const parentId = Number(id);
    if (!isNaN(parentId)) {
      setParentId(parentId, name);
    }

    // When the component unmounts, reset the parentId if navigating back
    return () => {
      // This logic might need adjustment based on navigation flow
    };
  }, [id, name, setParentId]);

  if (loading && !loadingMore) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <RetryView error={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs trail={breadcrumbs} onNavigate={(parentId) => setParentId(parentId)} />
      <Text style={styles.title}>{name}</Text>
      <CategoryList categories={categories} loadMore={loadMore} loadingMore={loadingMore} />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default CategoryPage;
