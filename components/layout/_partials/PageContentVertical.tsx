import { Heading } from '@/components/ui';
import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

interface PageContentVerticalProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const PageContentVertical = ({ title, children, style, ...props }: PageContentVerticalProps) => {
  return (
    <View style={[style, { gap: SPACING.md }]} {...props}>
      <Heading title={title} />
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};
