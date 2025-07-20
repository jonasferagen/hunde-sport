import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { Container, ContainerProps } from './Container';

export const Col = (props: ContainerProps): JSX.Element => {
    return <Container {...props} style={[styles.container, props.style]} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});