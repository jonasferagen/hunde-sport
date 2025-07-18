import { usePageContent, useTheme } from '@/contexts';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
  flex?: boolean;
}

export const Loader = ({ size = 'small', style, flex = false }: LoaderProps) => {
  const { themeManager } = useTheme();
  const { styleVariantName } = usePageContent();
  const themeVariant = themeManager.getVariant(styleVariantName);

  return (
    <View style={[styles.container, style, { flex: flex ? 1 : 0 }]}>
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
