import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

interface PageContentProps extends ViewProps {
  children: React.ReactNode;
  flex?: boolean;
  spacing?: keyof typeof SPACING;
  margin?: keyof typeof SPACING;
}

export const PageContent = ({ children, flex, spacing = 'md', margin = 'md', style, ...props }: PageContentProps) => {

  const marginStyle = {
    marginHorizontal: margin ? SPACING[margin] : 0,
  };

  return (
    <View style={[{ gap: SPACING[spacing], flex: flex ? 1 : 0 }, marginStyle, style]} {...props}>
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};
