import { PageContentProvider, useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import React from 'react';
import { ViewProps } from 'react-native';
import { PageContentHorizontal } from './_partials/PageContentHorizontal';
import { PageContentVertical } from './_partials/PageContentVertical';

interface PageContentProps extends ViewProps {
  children: React.ReactNode;
  flex?: boolean;
  gap?: keyof typeof SPACING;
  title?: string;
  paddingVertical?: keyof typeof SPACING;
  paddingHorizontal?: keyof typeof SPACING;
  horizontal?: boolean;
  primary?: boolean;
  secondary?: boolean;
  accent?: boolean;
  style?: any;
}

export const PageContent: React.FC<PageContentProps> = ({ children, flex, paddingVertical = 'md', paddingHorizontal = 'md', horizontal, primary = false, secondary = false, accent = false, style, ...props }: PageContentProps) => {
  const { themeManager } = useTheme();

  const type = primary ? 'primary' : secondary ? 'secondary' : accent ? 'accent' : 'default';
  const variant = themeManager.getVariant(type);
  const containerStyle = {
    backgroundColor: variant.backgroundColor,
    borderColor: variant.borderColor,
    borderWidth: 1,
  };

  const computedStyle = [
    { paddingHorizontal: paddingHorizontal ? SPACING[paddingHorizontal] : 0 },
    { paddingVertical: paddingVertical ? SPACING[paddingVertical] : 0 },
    containerStyle,
    style,
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
    <PageContentVertical style={[{ flex: flex ? 1 : 0 }, ...computedStyle]} {...props}>
      {content}
    </PageContentVertical>
  );
};
