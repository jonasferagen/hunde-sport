
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export default function Card({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 1,
    },

});
