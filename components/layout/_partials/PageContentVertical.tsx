import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

interface PageContentVerticalProps extends ViewProps {
  children: React.ReactNode;
}

export const PageContentVertical = ({ children, style, ...props }: PageContentVerticalProps) => {


  return (
    <View style={[style]} {...props}>
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};
