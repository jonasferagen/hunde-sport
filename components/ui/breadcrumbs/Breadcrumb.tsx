import { Link } from 'expo-router';
import React from 'react';

import { Icon } from '@/components/ui/icon/Icon';
import { Loader } from '@/components/ui/loader/Loader';
import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts/ThemeContext';
import { SPACING } from '@/styles';
import { Category } from '@/models/Category';
import { IStyleVariant } from '@/types';
import { StyleSheet } from 'react-native';

interface BreadcrumbProps {
  category?: Category;
  isLast?: boolean;
  isLastClickable?: boolean;
  loading?: boolean;
}

export const Breadcrumb = React.memo(({ category, isLast = false, isLastClickable = false, loading = false }: BreadcrumbProps) => {
  const { themeManager } = useThemeContext();
  const theme = themeManager.getVariant('default');
  const styles = createStyles(theme);


  if (loading) {
    return <Loader size="small" style={{ marginRight: SPACING.md }} />
  }

  if (!category) {
    return null;
  }


  return (
    <>
      {isLast && !isLastClickable ? (
        <CustomText style={styles.title}>{category.name}</CustomText>
      ) : (
        <Link
          replace
          href={routes.category(category)}
          asChild
        >
          <CustomText style={styles.link}>{category.name}</CustomText>
        </Link>
      )}
      {!isLast && <Icon
        name="breadcrumbSeparator"
        size="md"
        color={theme.text.primary}
        style={{ marginHorizontal: SPACING.xs, marginTop: 2 }}
      />}
    </>
  );
});

const createStyles = (theme: IStyleVariant) => StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  link: {
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },
});
