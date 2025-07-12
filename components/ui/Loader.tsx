import { COLORS } from '@/styles/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


interface LoaderProps {
  size?: 'small' | 'large',
}

const Loader = ({ size = 'large' }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.secondary} />
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

export default Loader;
