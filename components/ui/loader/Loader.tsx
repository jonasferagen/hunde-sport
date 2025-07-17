import { usePageContent, useTheme } from '@/contexts';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const Loader = ({ size = 'small', style }: LoaderProps) => {
  const { themeManager } = useTheme();
  const { styleVariantName } = usePageContent();
  const themeVariant = themeManager.getVariant(styleVariantName);

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={themeVariant.text.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
