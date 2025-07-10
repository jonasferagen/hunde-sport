import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';
import { SPACING } from './Dimensions';

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
    },
    pageSection: {
        padding: SPACING.md,
        flexGrow: 1,
        minHeight: 200, // Set a minimum height as fallback
    },
});

export default AppStyles;
