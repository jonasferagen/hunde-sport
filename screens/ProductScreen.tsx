import { Redirect, useLocalSearchParams } from "expo-router";

import { ProductCategoryChips } from "@/components/features/product-category/ProductCategoryChips";
import {
  ProductAvailabilityStatus,
  ProductDescription,
  ProductImage,
  ProductImageGallery,
  ProductPrice,
  ProductTitle,
} from "@/components/features/product/display/";
import { PurchaseFlow } from "@/components/features/product/purchase/PurchaseFlow";
import {
  PageBody,
  PageFooter,
  PageSection,
  PageView,
} from "@/components/layout";
import { ThemedXStack } from "@/components/ui";
import { Loader } from "@/components/ui/Loader";
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from "@/config/app";
import { ProductCategoryProvider } from "@/contexts/ProductCategoryContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { useProduct } from "@/hooks/data/Product";
import { useScreenReady } from "@/hooks/ui/useScreenReady";
import { useRenderGuard } from "@/hooks/useRenderGuard";
import { type PurchasableProduct } from "@/types";

export const ProductScreen = () => {
  useRenderGuard("ProductScreen");

  const ready = useScreenReady();
  const { id, productCategoryId: productCategoryIdFromParams } =
    useLocalSearchParams<{ id: string; productCategoryId?: string }>();
  const productId = Number(id);
  const productCategoryId = Number(productCategoryIdFromParams);
  const { data: product, isLoading } = useProduct(productId, {
    enabled: ready,
  });

  if (!ready) return null;

  if (isLoading) {
    return <Loader />;
  }
  if (!product) {
    return <Redirect href="/" />;
  }

  return (
    <ProductCategoryProvider
      productCategoryId={
        productCategoryId || product.categories[0]?.id || 0
      } /** @TODO at least one category should be guaranteed*/
    >
      <ProductProvider product={product}>
        <ProductScreenContent product={product as PurchasableProduct} />
      </ProductProvider>
    </ProductCategoryProvider>
  );
};

const ProductScreenContent = ({ product }: { product: PurchasableProduct }) => {
  return (
    <PageView theme="secondary">
      <PageBody mode="scroll">
        <PageSection theme={THEME_PRODUCT_ITEM_2}>
          <ProductImage product={product} />
        </PageSection>
        <PageSection theme={THEME_PRODUCT_ITEM_1} padded>
          <ThemedXStack split>
            <ProductTitle f={1} product={product} />
            <ProductPrice fos="$6" showIcon />
          </ThemedXStack>
          <ThemedXStack split>
            <ProductAvailabilityStatus
              productAvailability={product.availability}
            />
          </ThemedXStack>
        </PageSection>
        <PageSection
          padded
          title="Produktinformasjon"
          theme={THEME_PRODUCT_ITEM_2}
        >
          <ProductDescription product={product} long />
        </PageSection>
        <PageSection padded title="Produktbilder" theme={THEME_PRODUCT_ITEM_1}>
          {product.images.length > 0 && (
            <ProductImageGallery product={product} />
          )}
        </PageSection>
        <PageSection padded title="Kategorier" theme={THEME_PRODUCT_ITEM_2}>
          <ProductCategoryChips categoryRefs={product.categories} />
        </PageSection>
      </PageBody>
      <PageFooter>
        <PurchaseFlow product={product} />
      </PageFooter>
    </PageView>
  );
};
