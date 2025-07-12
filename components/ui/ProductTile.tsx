import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import type { Product } from '@/types';
import { formatPrice, rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { DimensionValue, ImageBackground, StyleSheet, Text, View } from "react-native";

const mainColor = COLORS.secondary;

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
}

export default function ProductTile({ product, width = '100%', height = '100%' }: ProductTileProps) {
    const { images, name, price } = product;
    const image = images[0];

    return (
        <View style={[styles.container, { width }]}>
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
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        marginRight: SPACING.sm,
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
    name: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
    },
});
