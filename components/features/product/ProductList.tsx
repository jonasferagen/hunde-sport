import { CustomText, Icon, Loader } from '@/components/ui';
import { routes } from '@/config/routing';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_SIZES, SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback, useState } from 'react';
import { Image, LayoutChangeEvent, Pressable, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface RenderProductProps {
    item: Product;
    onPress: (product: Product) => void;
}

const RenderProduct = memo(({ item, onPress }: RenderProductProps) => (
    <TouchableOpacity key={item.id}
        onPress={() => onPress(item)}
        style={styles.itemContainer}>
        <ProductListItem product={item} />
    </TouchableOpacity>
));

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    HeaderComponent?: React.ReactElement;
    EmptyComponent?: React.ReactElement;
    contentContainerStyle?: ViewStyle;
}

interface ProductListItemProps {
    product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
    const { addToCart } = useShoppingCart();
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setImageDimensions({ width: Math.round(width), height: Math.round(height) });
    };

    const imageUrl = getScaledImageUrl(product.images[0]?.src, imageDimensions.width, imageDimensions.height);

    return (
        <View key={product.id} style={styles.container}>
            <View onLayout={handleLayout} style={styles.imageContainer}>
                {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
            </View>
            <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <CustomText style={styles.name} numberOfLines={1}>{product.name}</CustomText>
                <CustomText style={styles.price}>{formatPrice(product.price)}</CustomText>
            </View>
            <Pressable onPress={() => addToCart(product)} style={styles.addToCartButton}    >
                <View className="justify-center">
                    <Icon name="addToCart" color="black" />
                </View>
            </Pressable>
        </View>
    );
};

export const ProductList = memo(({ products, loadMore, loadingMore, HeaderComponent, EmptyComponent, contentContainerStyle }: ProductListProps) => {

    const handleProductPress = useCallback((product: Product) => {
        routes.product(product);
    }, []);

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <RenderProduct item={item} onPress={handleProductPress} />
    ), [handleProductPress]);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return (

        <FlashList style={styles.listStyle}
            data={products}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={HeaderComponent}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={contentContainerStyle}
            ListFooterComponent={() =>
                loadingMore ? <Loader /> : null
            }
            estimatedItemSize={50}
        />

    );
});

const styles = StyleSheet.create({

    listStyle: {
        flex: 1,
    },

    itemContainer: {
        flex: 1,
        marginTop: SPACING.sm,
    },

    container: {
        backgroundColor: 'white',
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: 50,
        height: 50,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    addToCartButton: {
        marginRight: SPACING.md,
    },
    name: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
    },
    price: {
        color: 'gray',
        marginTop: SPACING.xs,
    },
});
