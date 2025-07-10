import type { Category } from '@/types';
import { router } from 'expo-router';
import { memo } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

interface CategoryListItemProps extends Category {
  style?: StyleProp<ViewStyle>;
}

// Memoized list item component with areEqual comparison
const CategoryListItem = memo<CategoryListItemProps>(
  ({ id, name, style }) => {
    const handlePress = () => {
      router.push({
        pathname: '/category',
        params: {
          id: id.toString(),
          name: name,
        },
      });
    };

    return (
      <TouchableOpacity onPress={handlePress} style={style}>
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
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    padding: SPACING.sm,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
  },
  categoryText: {
    width: '100%',
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.md,
    padding: SPACING.xs,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
  }
});

export default CategoryListItem;
