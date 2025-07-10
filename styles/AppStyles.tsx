import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from './Theme';

export const AppStyles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginVertical: SPACING.md,
    },

    pageView: {
        flex: 1,
        backgroundColor: COLORS.accent,
    },

    pageContent: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
});


export default AppStyles;
