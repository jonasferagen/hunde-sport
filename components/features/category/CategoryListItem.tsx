import type { Category } from '@/types';
import { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import Chip from '@/components/ui/Chip';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';

interface CategoryListItemProps {
  category: Category;
  style?: StyleProp<ViewStyle>;
}

// Memoized list item component with areEqual comparison
export const CategoryListItem = memo<CategoryListItemProps>(
  ({ category, style }) => {
    const { breadcrumbs, setTrail } = useBreadcrumbs();

    const handlePress = () => {
      const newTrail = [...breadcrumbs];
      newTrail.push({ id: category.id, name: category.name, type: "category" as const });
      setTrail(newTrail, true);
    };

    return (
      <Chip
        label={category.name}
        onPress={handlePress}
        variant="primary"
        style={style}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.category.id === nextProps.category.id && prevProps.category.name === nextProps.category.name;
  }
);

export default CategoryListItem;
