import { CustomText } from '@/components/ui/text';
import { FONT_SIZES, SPACING } from '@/styles';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';

interface ListItemProps extends ViewProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    price?: string;
    onPress?: () => void;
    actionComponent?: React.ReactNode;
    imageSize?: number;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    imageUrl,
    price,
    onPress,
    actionComponent,
    imageSize = 60,
    ...viewProps
}) => {
    const imageStyle = { width: imageSize, height: imageSize };

    return (
        <View style={styles.itemContainer} {...viewProps}>
            <View style={styles.infoWrapper}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.pressableContent} onPress={onPress} disabled={!onPress}>
                        <View style={[styles.imageContainer, imageStyle]}>
                            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
                        </View>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.name} numberOfLines={1}>{title}</CustomText>
                        </View>
                    </TouchableOpacity>
                    {price && <CustomText style={styles.price}>{price}</CustomText>}
                </View>
            </View>
            <View style={styles.bottomRow}>
                {subtitle && <CustomText style={styles.subtitle} numberOfLines={2}>{subtitle}</CustomText>}
                {actionComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: 'white',
        padding: SPACING.md,
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
