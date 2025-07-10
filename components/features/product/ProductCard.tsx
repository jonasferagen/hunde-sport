import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import type { Image } from '@/types';
import { formatPrice, rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const mainColor = COLORS.secondary;

interface ProductCardProps {
    image: Image;
    title: string;
    price: string;
    width?: number | string;
}

export default function ProductCard({ image, title, price, width = '100%' }: ProductCardProps) {


    return (
        <View style={[styles.container]}>
            <ImageBackground
                source={{ uri: image.src }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{formatPrice(price)}</Text>
                </View>

                <LinearGradient
                    colors={[rgba(mainColor, .7), rgba(mainColor, 1)]}
                    style={styles.gradient}
                >
                    <Text style={styles.title} numberOfLines={2}>
                        {(title)}
                    </Text>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        aspectRatio: .8,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'space-between',
    },
    priceContainer: {
        alignSelf: 'flex-end',
        backgroundColor: mainColor,
        opacity: 0.9,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        margin: SPACING.sm,
    },
    priceText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.md,
    },
    imageStyle: {
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradient: {
        padding: SPACING.sm,
        minHeight: 60, // Ensure gradient has minimum height
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
    },
});
