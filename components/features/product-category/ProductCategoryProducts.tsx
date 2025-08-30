import { ThemedYStack } from "@/components/ui";
import { Loader } from "@/components/ui/Loader";
import { useProductsByProductCategory } from "@/hooks/data/Product";
import { useRenderGuard } from "@/hooks/useRenderGuard";
import { ProductCategory } from "@/types";

import { ProductList } from "../product/list/ProductList";

type Props = {
  productCategory: ProductCategory;
};

export const ProductCategoryProducts = ({ productCategory }: Props) => {
  useRenderGuard("ProductCategoryProducts");

  const {
    items: products = [],
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    total,
  } = useProductsByProductCategory(productCategory);

  console.log(
    productCategory.name + ":" + productCategory.id,
    productCategory.count + ":" + total
  );

  return (
    <ThemedYStack f={1} mih={0}>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductList
          transitionKey={productCategory.id}
          products={products}
          loadMore={fetchNextPage}
          isLoadingMore={isFetchingNextPage}
          hasMore={hasNextPage}
          totalProducts={total}
        />
      )}
    </ThemedYStack>
  );
};
