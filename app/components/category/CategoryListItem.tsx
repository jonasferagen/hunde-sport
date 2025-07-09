import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Category } from '../../../types';

// Memoized list item component with areEqual comparison
const CategoryListItem = memo<Category>(
  ({ id, name }) => {
    const handlePress = () => {
      router.push({
        pathname: '/categoryPage',
        params: {
          name: name,
          id: id.toString(),
        },
      });
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.categoryItem}>
          <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail" selectable={false}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id && prevProps.name === nextProps.name;
  }
);

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
  },
});

export default CategoryListItem;
