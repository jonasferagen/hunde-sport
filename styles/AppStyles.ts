import { StyleSheet } from 'react-native';
import { Theme } from './Colors';
import { SPACING } from './Dimensions';

export const createAppStyles = (theme: Theme) => StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        marginVertical: SPACING.md,
    },
});
