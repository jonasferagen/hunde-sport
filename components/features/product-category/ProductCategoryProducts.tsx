import { ProductList } from "@/components/features/product/list/ProductList";
import { Loader } from "@/components/ui/Loader";
import { ThemedYStack } from "@/components/ui/themed";
import { useProductsByProductCategory } from "@/hooks/api/data/product/queries";
import { useRenderGuard } from "@/hooks/useRenderGuard";
import { ProductCategory } from "@/types";

type Props = {
  productCategory: ProductCategory;
};

export const ProductCategoryProducts = ({ productCategory }: Props) => {
  useRenderGuard("ProductCategoryProducts");

  const { items: products = [], isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, total } = useProductsByProductCategory(productCategory);

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
