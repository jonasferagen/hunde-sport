// app/index.tsx
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import { StyleSheet, Text, View } from 'react-native';

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
    <View>
      <Text style={styles.title}>Hva leter du etter?</Text>
      <FeaturedProducts />
      <Text style={styles.title}>Andre kategorier</Text>
      <Categories categoryId={rootCategoryId} />
    </View>
  );
}