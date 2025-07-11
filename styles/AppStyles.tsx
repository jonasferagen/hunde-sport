import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';
import { SPACING } from './Dimensions';

export const AppStyles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        marginVertical: SPACING.md,
    },

});

export default AppStyles;
