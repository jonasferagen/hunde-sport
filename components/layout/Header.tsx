import { useTheme } from '@/contexts';
import { FONT_FAMILY } from '@/styles';
import { Theme } from '@/types';
import React, { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps): JSX.Element => {
    const { theme } = useTheme();

    const styles = createHeaderStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const createHeaderStyles = (theme: Theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: theme.textOnColor.primary,
        fontFamily: FONT_FAMILY.bold,
        fontSize: 18,
    },
});
