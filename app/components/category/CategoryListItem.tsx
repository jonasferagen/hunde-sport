import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Category } from '../../../types';
import CategoryImage from './CategoryImage';

// Memoized list item component with areEqual comparison
const CategoryListItem = memo<Category>(
  ({ id, name, image }) => {
    const handlePress = () => {
      router.push({
        pathname: '/category',
        params: {
          name: name,
          id: id.toString(),
        },
      });
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.categoryItem}>
          {image && (
            <View style={styles.categoryImage}>
              <CategoryImage image={image} />
            </View>
          )}
          <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail" selectable={false}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id && prevProps.name === nextProps.name && prevProps.image?.src === nextProps.image?.src;
  }
);

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
  },
});

export default CategoryListItem;
