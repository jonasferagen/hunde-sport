import { Redirect, useLocalSearchParams } from "expo-router";
import { YStack } from "tamagui";

import { PageBody, PageSection, PageView } from "@/components/chrome/layout";
import { PageHeader } from "@/components/chrome/layout/PageHeader";
import { Breadcrumbs } from "@/components/features/product-category/Breadcrumbs";
import { ProductCategoryHeader } from "@/components/features/product-category/ProductCategoryHeader";
import { ProductCategoryProducts } from "@/components/features/product-category/ProductCategoryProducts";
import { ThemedXStack, ThemedYStack } from "@/components/ui/themed";
import { useScreenReady } from "@/hooks/ui/useScreenReady";
import { useRenderGuard } from "@/hooks/useRenderGuard";
import {
  useBreadcrumbTrail,
  useProductCategories,
  useProductCategory,
} from "@/stores/productCategoryStore";

export const ProductCategoryScreen = () => {
  useRenderGuard("ProductCategoryScreen");
  const ready = useScreenReady();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productCategory = useProductCategory(Number(id));
  const productCategories = useProductCategories(Number(id));
  const trail = useBreadcrumbTrail(Number(id));

  if (!productCategory || productCategory.id === 0) {
    return <Redirect href="/" />;
  }

  return (
    <PageView>
      <PageHeader theme="shade">
        <ThemedXStack box split>
          <ThemedYStack f={1}>
            <Breadcrumbs trail={trail} isLastClickable />
          </ThemedYStack>
          <YStack>
            <ProductCategoryHeader
              productCategory={productCategory}
              productCategories={productCategories}
            />
          </YStack>
        </ThemedXStack>
      </PageHeader>
      <PageBody>
        <PageSection fill f={1} mih={0}>
          {ready && (
            <ProductCategoryProducts productCategory={productCategory} />
          )}
        </PageSection>
      </PageBody>
    </PageView>
  );
};
