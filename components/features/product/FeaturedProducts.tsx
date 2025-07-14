import { ProductTile } from "@/components/ui/";
import { Loader } from "@/components/ui/Loader";
import { useBreadcrumbs } from "@/hooks/Breadcrumb/BreadcrumbProvider";
import { useFeaturedProducts } from "@/hooks/Product/Product";
import { ScrollView } from "react-native";

export const FeaturedProducts = () => {

    const { products, isLoading } = useFeaturedProducts();
    const { addCategory } = useBreadcrumbs();

    if (isLoading) {
        return <Loader />;
    }

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <ProductTile key={product.id} product={product} width={200} height={150} mainColor={'#777'} />
        ))}
    </ScrollView>


}