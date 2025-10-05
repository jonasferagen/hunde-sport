import { ProductList } from "@/components/features/product/list/ProductList";
import { ThemedYStack } from "@/components/ui/themed";
import { useProductsByProductCategory } from "@/hooks/api/data/product/queries";
import { useRenderGuard } from "@/hooks/useRenderGuard";
import { ProductCategory } from "@/types";

type Props = {
  productCategory: ProductCategory;
};

export const ProductCategoryProducts = ({ productCategory }: Props) => {
  useRenderGuard("ProductCategoryProducts");

  const {
    items: products = [],
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    total,
  } = useProductsByProductCategory(productCategory);

  return (
    <ThemedYStack f={1} mih={0}>
      <ProductList
        transitionKey={productCategory.id}
        products={products}
        isLoading={isLoading}
        loadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
        hasMore={hasNextPage}
        totalProducts={total}
      />
    </ThemedYStack>
  );
};
