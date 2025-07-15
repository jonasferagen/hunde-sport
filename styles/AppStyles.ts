import { Theme } from '@/types';
import { StyleSheet } from 'react-native';
import { SPACING } from './Dimensions';

export const createAppStyles = (theme: Theme) => StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        marginVertical: SPACING.md,
    },
});
