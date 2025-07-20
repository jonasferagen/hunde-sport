import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Loader } from '@/components/ui';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts/ThemeContext';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { CustomText } from '../text/CustomText';

interface BreadcrumbProps {
  category?: Category;
  isCurrent?: boolean;
  loading?: boolean;
}

export const Breadcrumb = React.memo(({ category, isCurrent = false, loading = false }: BreadcrumbProps) => {
  const { themeManager } = useThemeContext();
  const theme = themeManager.getVariant('card');

  if (loading) {
    return <Loader size="small" />
  }

  if (!category) {
    return null;
  }

  return (
    <>
      <Link
        replace
        href={routes.category(category)}
        asChild
      >
        <CustomText style={[styles.text, { color: theme.text.primary, fontWeight: isCurrent ? 'bold' : 'normal' }]}>{category.name}</CustomText>
      </Link>
      {!isCurrent && <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.text.primary}
        style={styles.icon}
      />}
    </>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  icon: {
    marginHorizontal: SPACING.xs,
  },
});
