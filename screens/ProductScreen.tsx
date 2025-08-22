import { Breadcrumbs } from '@/components/features/product-category/breadcrumbs/Breadcrumbs';
import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { ProductDescription, ProductImage, ProductImageGallery, ProductPrice, ProductTitle } from '@/components/features/product/display/';
import { ProductPurchaseFlow } from '@/components/features/product/purchase/ProductPurchaseFlow';
import { PageBody, PageFooter, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedXStack } from '@/components/ui';
import { ProductCategoryProvider } from '@/contexts/ProductCategoryContext';
import { useProduct } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { useScreenTitle } from '@/hooks/useScreenTitle';
import { Prof } from '@/lib/debug/prof';
import { PurchasableProduct } from '@/types';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Loader } from '../components/ui/Loader';

export const ProductScreen = () => {
  useRenderGuard('ProductScreen');

  const ready = useScreenReady();
  const { id, productCategoryId: productCategoryIdFromParams, } = useLocalSearchParams<{ id: string; productCategoryId?: string }>();
  const productId = Number(id);
  const productCategoryId = Number(productCategoryIdFromParams);
  const { data: product, isLoading } = useProduct(productId, { enabled: ready });

  if (!ready) return null;

  if (isLoading) {
    return <Loader />
  }
  if (!product) {
    return <Redirect href="/" />;
  }

  return (
    <ProductCategoryProvider productCategoryId={productCategoryId || product.categories[0].id} >
      <ProductScreenContent product={product as PurchasableProduct} />
    </ProductCategoryProvider>
  );
};


const ProductScreenContent = ({ product }: { product: PurchasableProduct }) => {
  useScreenTitle(product.name);

  return (
    <Prof id="ProductScreen">
      <PageView>
        <PageHeader><Breadcrumbs isLastClickable={false} /></PageHeader>
        <PageBody mode="scroll">
          <PageSection>
            <ProductImage product={product} />
          </PageSection>
          <PageSection padded>
            <ThemedXStack split>
              <ProductTitle product={product} size="$5" fs={1} />
              <ProductPrice product={product} size="$5" />
            </ThemedXStack>
          </PageSection>
          <PageSection padded title="Produktinformasjon" theme="primary">
            <ProductDescription product={product} long />
          </PageSection>
          <PageSection padded title="Produktbilder">
            {product.images.length > 0 && <ProductImageGallery product={product} />}
          </PageSection>
          <PageSection padded title="Kategorier">
            <ProductCategoryChips productCategories={product.categories} />
          </PageSection>
        </PageBody>
        <PageFooter>
          <ProductPurchaseFlow product={product} />
        </PageFooter>
      </PageView>
    </Prof>
  );
};
