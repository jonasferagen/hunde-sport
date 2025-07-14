import { ProductTile } from "@/components/ui/";
import { Loader } from "@/components/ui/Loader";
import { useCategories, useCategory } from "@/hooks/Category/Category";
import { useFeaturedProducts } from "@/hooks/Product/Product";
import { Product } from "@/types";
import { ScrollView } from "react-native";


const FeaturedProduct = ({ product }: { product: Product }) => {


    if (product.categories.length === 0) {
        return null;
    }

    product.categories.forEach(data => {

        const { id, name } = data;
        const { category } = useCategory(id);
    });


    return <ProductTile key={product.id} product={product} width={200} height={150} mainColor={'#777'} onPress={() => { }} />
}


export const FeaturedProducts = () => {

    const { products, isLoading } = useFeaturedProducts();
    const { categories } = useCategories(0);
    console.log(categories.length);

    if (isLoading) {
        return <Loader />;
    }

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <FeaturedProduct product={product} />
        ))}
    </ScrollView>


}