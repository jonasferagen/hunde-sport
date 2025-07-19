import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { routes } from '@/config/routes';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Icon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

interface BreadcrumbProps {
  category: Category;
  isLast: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Breadcrumb = React.memo(({ category, isLast, style }: BreadcrumbProps) => {
  return (
    <React.Fragment key={category.id}>
      <Link
        replace
        href={routes.category(category)}
        asChild
      >
        <Pressable style={[styles.crumbContainer, style]}>
          <CustomText style={styles.crumbText}>{category.name}</CustomText>
        </Pressable>
      </Link>
      {!isLast && (
        <Icon
          name="breadcrumbSeparator"
          color={styles.crumbText.color}
          size={'sm'}
          style={styles.crumbSeparator}
        />
      )}
    </React.Fragment>
  );
});

const styles = {
  crumbContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  crumbText: {
    color: 'black'
  },
  crumbSeparator: {
    marginHorizontal: SPACING.xs,
    top: 0,
  },
};

export default Breadcrumb;
