import { CustomText } from '@/components/ui/text/CustomText';
import { FONT_SIZES, SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

interface ListItemProps extends ViewProps {
    product: Product;
    index: number;
    onPress?: () => void;
    actionComponent?: React.ReactNode;
    imageSize?: number;
}

export const ListItem: React.FC<ListItemProps> = ({
    product,
    index,
    onPress,
    actionComponent,
    imageSize = 60,
    ...viewProps
}) => {
    const imageStyle = { width: imageSize, height: imageSize };
    const imageUrl = product.images?.[0]?.src;

    const styles = createStyles(index);

    return (
        <View style={styles.itemContainer} {...viewProps}>
            <View style={styles.infoWrapper}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.pressableContent} onPress={onPress} disabled={!onPress}>
                        <View style={[styles.imageContainer, imageStyle]}>
                            {imageUrl && <Image source={{ uri: getScaledImageUrl(imageUrl, imageSize, imageSize) }} style={styles.image} />}
                        </View>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.name} numberOfLines={1}>{product.name} {product.id}</CustomText>
                        </View>
                    </TouchableOpacity>
                    {product.price && <CustomText style={styles.price}>{formatPrice(product.price)}</CustomText>}
                </View>
            </View>
            <View style={styles.bottomRow}>
                {product.short_description && <CustomText style={styles.subtitle} numberOfLines={2}>{product.short_description}</CustomText>}
                {actionComponent}
            </View>
        </View>
    );
};

const createStyles = (index: number) => StyleSheet.create({

    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    infoWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bottomRow: {
        marginTop: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    pressableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: SPACING.md,
    },
    imageContainer: {
        borderRadius: SPACING.sm,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
        flexShrink: 1,
    },
    price: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
        paddingLeft: SPACING.md,
    },
    subtitle: {
        color: 'gray',
        fontSize: FONT_SIZES.sm,
        flex: 1,
    },
});
