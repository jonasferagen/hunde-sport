import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface RetryViewProps {
  error: string;
  onRetry: () => void;
}

export const RetryView: React.FC<RetryViewProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      <Button onPress={onRetry} title="Retry" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
});

