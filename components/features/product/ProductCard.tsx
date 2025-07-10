import type { Image } from '@/types';
import { decodeHtmlEntities, formatPrice, rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

const mainColor = COLORS.secondary;

export default function ProductCard({ image, title, price }: { image: Image, title: string, price: string }) {

    return (
        <ImageBackground source={{ uri: image.src }} style={styles.container} imageStyle={styles.imageStyle}>
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{formatPrice(price)}</Text>
            </View>

            <LinearGradient
                colors={[rgba(mainColor, .7), rgba(mainColor, 1)]}
                style={styles.gradient}
            >
                <Text style={styles.title} numberOfLines={2}>{decodeHtmlEntities(title)}</Text>
            </LinearGradient>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    container: {
        height: 250,
        width: 180,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        justifyContent: 'flex-end',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 5,
    },
    priceContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: mainColor,
        opacity: .9,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    priceText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.md,
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    gradient: {
        height: '20%',
        justifyContent: 'center',
        padding: SPACING.sm
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.xs,
        textAlign: 'center',
    }
});
