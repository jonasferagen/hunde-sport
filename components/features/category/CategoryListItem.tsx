import type { Category } from '@/types';
import { memo } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

interface CategoryListItemProps {
  category: Category;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

// Memoized list item component with areEqual comparison
export const CategoryListItem = memo<CategoryListItemProps>(
  ({ category, style, compact = false }) => {
    const { breadcrumbs, setTrail } = useBreadcrumbs();

    const handlePress = () => {
      const newTrail = [...breadcrumbs];
      newTrail.push({ id: category.id, name: category.name, type: "category" as const });
      console.log("Breadcrumbs: ", breadcrumbs)
      console.log(newTrail);
      setTrail(newTrail, true);
    };

    return (
      <TouchableOpacity onPress={handlePress} style={[styles.container, style, compact && styles.containerCompact]}>
        <View style={[styles.categoryItem, compact && styles.categoryItemCompact]}>
          <Text style={[styles.categoryText, compact && styles.categoryTextCompact]} numberOfLines={1} ellipsizeMode="tail" selectable={false}>
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.category.id === nextProps.category.id && prevProps.category.name === nextProps.category.name && prevProps.compact === nextProps.compact;
  }
);

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  containerCompact: {
    width: '33%',
  },
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
  categoryItemCompact: {
    padding: SPACING.xs,
  },
  categoryText: {
    width: '100%',
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.md,
    padding: SPACING.xs,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  categoryTextCompact: {
    fontSize: FONT_SIZES.sm,
  }
});

export default CategoryListItem;
