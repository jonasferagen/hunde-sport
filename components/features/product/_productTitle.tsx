import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface ProductTitleProps {
  name: string;
}

export const ProductTitle: React.FC<ProductTitleProps> = ({ name }) => {
  return <Text style={styles.title}>{name}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
});
