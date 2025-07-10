import type { Category } from '@/types';
import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/config/theme';

// Memoized list item component with areEqual comparison
const CategoryListItem = memo<Category>(
  ({ id, name }) => {
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
    flexDirection: 'column',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    width: 100,
    justifyContent: 'center',

  },
  categoryText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    padding: SPACING.xs,
  }
});

export default CategoryListItem;
