import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts/ThemeContext';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Icon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

interface BreadcrumbProps {
  category?: Category;
  isCurrent?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Breadcrumb = React.memo(({ category, isCurrent = false, loading = false, style }: BreadcrumbProps) => {
  const { themeManager } = useThemeContext();
  const theme = themeManager.getVariant('card');

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <Icon name="loader" size={'sm'} />
      </View>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Link
        replace
        href={routes.category(category)}
        asChild
      >
        <CustomText style={[styles.text, { color: theme.text.primary, fontWeight: isCurrent ? 'bold' : 'normal' }]}>
          {category.name}
        </CustomText>
      </Link>
      {!isCurrent && <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.text.primary}
        style={styles.icon}
      />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
  icon: {
    marginHorizontal: SPACING.xs,
  },
});

export default Breadcrumb;
