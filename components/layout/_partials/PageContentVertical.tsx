import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';
import { PageContentTitle } from './PageContentTitle';

interface PageContentVerticalProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const PageContentVertical = ({ title, children, style, ...props }: PageContentVerticalProps) => {

  const gap = SPACING.md;

  return (
    <View style={[style, { gap: 0 }]} {...props}>
      <PageContentTitle title={title} />
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};
