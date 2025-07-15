import { useTheme } from '@/hooks/Theme/ThemeProvider';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Loader = ({ size = 'large', color }: LoaderProps) => {
  const { theme } = useTheme();
  const loaderColor = color || theme.textOnColor.primary;

  return (
    <View style={styles.container}>
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
