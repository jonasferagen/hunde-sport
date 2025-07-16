import { PageContentProvider, useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import { Theme } from '@/types';
import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { PageContentHorizontal } from './_partials/PageContentHorizontal';
import { PageContentVertical } from './_partials/PageContentVertical';

interface PageContentProps extends ViewProps {
  children: React.ReactNode;
  flex?: boolean;
  gap?: keyof typeof SPACING;
  paddingVertical?: keyof typeof SPACING;
  paddingHorizontal?: keyof typeof SPACING;
  horizontal?: boolean;
  primary?: boolean;
  secondary?: boolean;
  accent?: boolean;
}

export const PageContent = ({ children, flex, gap = 'md', paddingVertical = 'md', paddingHorizontal = 'md', style, horizontal, primary = false, secondary = false, accent = false, ...props }: PageContentProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const type = primary ? 'primary' : secondary ? 'secondary' : accent ? 'accent' : 'default';

  const computedStyle = [
    { paddingHorizontal: paddingHorizontal ? SPACING[paddingHorizontal] : 0 },
    { paddingVertical: paddingVertical ? SPACING[paddingVertical] : 0 },
    styles[type],
    style
  ];

  const content = (
    <PageContentProvider value={{ type }}>
      {children}
    </PageContentProvider>
  );

  if (horizontal) {
    return (
      <PageContentHorizontal style={computedStyle} {...props}>
        {content}
      </PageContentHorizontal>
    );
  }

  return (
    <PageContentVertical style={[{ gap: SPACING[gap], flex: flex ? 1 : 0 }, ...computedStyle]} {...props}>
      {content}
    </PageContentVertical>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  default: {},
});

