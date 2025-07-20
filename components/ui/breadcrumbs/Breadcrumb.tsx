import { Link } from 'expo-router';
import React from 'react';

import { Icon } from '@/components/ui/icon/Icon';
import { Loader } from '@/components/ui/loader/Loader';
import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts/ThemeContext';
import { SPACING } from '@/styles';
import { Category } from '@/types';

interface BreadcrumbProps {
  category?: Category;
  isCurrent?: boolean;
  loading?: boolean;
}

export const Breadcrumb = React.memo(({ category, isCurrent = false, loading = false }: BreadcrumbProps) => {
  const { themeManager } = useThemeContext();
  const theme = themeManager.getVariant('card');



  if (loading) {
    return <Loader size="small" style={{ marginRight: SPACING.md }} />
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
        <CustomText bold={isCurrent}>{category.name}</CustomText>
      </Link>
      {!isCurrent && <Icon
        name="breadcrumbSeparator"
        size="md"
        color={theme.text.primary}
        style={{ marginHorizontal: SPACING.xs, marginTop: 2 }}
      />}
    </>
  );
});

