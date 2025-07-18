import React, { JSX } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { SPACING } from '@/styles/Dimensions';

interface FormRowProps extends ViewProps {
    children: React.ReactNode;
}

export const FormRow = ({ children, style, ...props }: FormRowProps): JSX.Element => {
    return (
        <View style={[styles.row, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
});
