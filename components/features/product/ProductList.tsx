import { Icon, Loader } from '@/components/ui';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { routes } from '@/lib/routing';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface RenderProductProps {
    item: Product;
    onPress: (id: number) => void;
}

const RenderProduct = memo(({ item, onPress }: RenderProductProps) => (
    <TouchableOpacity key={item.id}
        onPress={() => onPress(item.id)}
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

}


interface ProductListItemProps {
    product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
    const { addToCart } = useShoppingCart();

    console.log(product.id + ' ' + product.name + ' rendered');

    return (
        <View key={product.id} style={styles.container}>
            <Image source={{ uri: product.images[0].src }} style={styles.image} />
            <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>
            <Pressable onPress={() => addToCart(product)} style={styles.addToCartButton}    >
                <View className="justify-center">
                    <Icon name="addToCart" size={24} color="black" />
                </View>
            </Pressable>
        </View>
    );
};

export const ProductList = memo(({ products, loadMore, loadingMore, HeaderComponent, EmptyComponent }: ProductListProps) => {


    const handleProductPress = useCallback((id: number) => {
        routes.productSimple(id);
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
        marginBottom: 8,
    },

    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
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
        marginTop: 5,
    },
});
