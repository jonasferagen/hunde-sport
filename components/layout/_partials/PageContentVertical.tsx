import { Heading } from '@/components/ui';
import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface PageContentVerticalProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const PageContentVertical = ({ title, children, style, ...props }: PageContentVerticalProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {title && (
        <View style={styles.titleContainer}>
          <Heading title={title} />
        </View>
      )}
      {Children.toArray(children).filter(child => Boolean(child))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  titleContainer: {
    paddingHorizontal: SPACING.md,
  },
});
