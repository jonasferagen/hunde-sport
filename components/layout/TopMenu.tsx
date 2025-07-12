import { SPACING } from '@/styles/Dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Heading } from '../ui';

export default function TopMenu() {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => { /* TODO: open drawer */ }}>
                <MaterialCommunityIcons name="menu" size={24} />
            </Pressable>
            <Heading title="hunde-sport.no" size="lg" style={styles.heading} />
            <Pressable onPress={() => { /* TODO: open cart */ }}>
                <MaterialCommunityIcons name="cart-outline" size={24} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    heading: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
});
