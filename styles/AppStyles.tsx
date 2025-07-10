import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';
import { SPACING } from './Theme';

export const AppStyles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        marginVertical: SPACING.md,
    },

    pageView: {
        flex: 1,
    },

    pageContent: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
});


export default AppStyles;
