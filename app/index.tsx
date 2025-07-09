// app/index.tsx
import { StyleSheet, Text, View } from 'react-native';
import CategoryList from './components/category/CategoryList';
import FullScreenLoader from './components/FullScreenLoader';
import RetryView from './components/RetryView';
import { useProductCategories } from './contexts/ProductCategory';

// Memoized styles to prevent recreation on every render
const createStyles = () => {
  return StyleSheet.create({
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
};

const styles = createStyles();

export default function Index() {
  const { categories, loading, loadingMore, error, loadMore, refresh } = useProductCategories(0);

  // Show loader only when root categories are loading and list is empty
  if (loading && categories.length === 0) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <RetryView error={error} onRetry={refresh} />;
  }

  return (
    <View>
      <Text style={styles.title}>Hva leter du etter?</Text>
      <CategoryList categories={categories} loadMore={loadMore} loadingMore={loadingMore} />
    </View>
  );
}