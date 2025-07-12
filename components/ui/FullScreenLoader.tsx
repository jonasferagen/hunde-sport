import { COLORS } from '@/styles/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const FullScreenLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.secondary} />
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

export default FullScreenLoader;
