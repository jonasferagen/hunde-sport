import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface ProductShortDescriptionProps {
  short_description: string;
}

export const ProductShortDescription: React.FC<ProductShortDescriptionProps> = ({ short_description }) => {
  return <Text style={styles.shortDescription}>{short_description}</Text>;
};

const styles = StyleSheet.create({
  shortDescription: {
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
});
