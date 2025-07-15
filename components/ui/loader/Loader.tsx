import { useTheme } from '@/contexts';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Loader = ({ size = 'large', color, style }: LoaderProps) => {
  const { theme } = useTheme();
  const loaderColor = color || theme.textOnColor.primary;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={loaderColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
