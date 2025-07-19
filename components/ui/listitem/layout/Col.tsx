import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from './Container';
import { ContainerProps } from './types';

export const Col = (props: ContainerProps): JSX.Element => {
    return <Container {...props} style={[styles.container, props.style]} />;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
});