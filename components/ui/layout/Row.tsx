import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { Container, ContainerProps } from './Container';

export const Row = ({ alignItems = 'center', justifyContent = 'space-between', ...props }: ContainerProps): JSX.Element => {
    return <Container alignItems={alignItems} justifyContent={justifyContent} {...props} style={[styles.container, props.style]} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});