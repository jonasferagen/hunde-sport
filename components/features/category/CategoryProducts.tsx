import { useProductsByCategory } from "@/hooks/Product/Product";
import { SPACING } from "@/styles/Dimensions";
import { Category } from "@/types";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Loader from "../../ui/Loader";
import ProductList from "../product/ProductList";

interface CategoryProductsProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
}
export function CategoryProducts({ category, style }: CategoryProductsProps) {

    const { products, isLoading, isFetchingNextPage, loadMore } = useProductsByCategory(category.id);

    if (isLoading) {
        return <Loader />;
    }

    return <View style={[styles.container, style]}>
        <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={loadMore} />
    </View>

}

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.md,
        flex: 1
    },
});