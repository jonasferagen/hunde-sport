// app/index.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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

const rootCategoryId = 0;

export default function Index() {
  return (
    <ScrollView>
      <Text style={styles.title}>Hva leter du etter?</Text>
      <FeaturedProducts />
      <Text style={styles.title}>Andre kategorier</Text>
      <Categories categoryId={rootCategoryId} />
    </ScrollView>
  );
}