import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from './Container';
import { ContainerProps } from './types';

export const Row = (props: ContainerProps): JSX.Element => {
    return <Container {...props} style={[styles.container, props.style]} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});