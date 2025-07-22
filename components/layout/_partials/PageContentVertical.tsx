import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { H4 } from 'tamagui';

interface PageContentVerticalProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const PageContentVertical = ({ title, children, style, ...props }: PageContentVerticalProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {title && (
        <H4>{title}</H4>
      )}
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
});
