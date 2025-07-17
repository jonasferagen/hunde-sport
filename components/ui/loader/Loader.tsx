import { usePageContent, useTheme } from '@/contexts';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const Loader = ({ size = 'small', style }: LoaderProps) => {
  const { theme } = useTheme();
  const { type } = usePageContent();
  const loaderColor = theme.textOnColor[type];


  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={loaderColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
