
import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { ProductDescription, ProductImage, ProductImageGallery, ProductPrice, ProductTitle } from '@/components/features/product/display/';
import { ProductPurchaseFlow } from '@/components/features/product/purchase/ProductPurchaseFlow';
import { PageBody, PageFooter, PageSection, PageView } from '@/components/layout';
import { ThemedXStack } from '@/components/ui';
import { ProductCategoryProvider } from '@/contexts/ProductCategoryContext';
import { useProduct } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/ui/useScreenReady';
import { Prof } from '@/lib/debug/prof';
import { PurchasableProduct } from '@/types';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Loader } from '../components/ui/Loader';
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from '@/config/app';

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

  return (
    <Prof id="ProductScreen">
      <PageView theme="secondary">
        <PageBody mode="scroll">
          <PageSection theme={THEME_PRODUCT_ITEM_2}>
            <ProductImage product={product} />
          </PageSection>
          <PageSection theme={THEME_PRODUCT_ITEM_1} padded>
            <ThemedXStack split>
              <ProductTitle product={product} size="$5" fs={1} />
              <ProductPrice product={product} size="$5" showIcon />
            </ThemedXStack>
          </PageSection>
          <PageSection padded title="Produktinformasjon" theme={THEME_PRODUCT_ITEM_2} >
            <ProductDescription product={product} long />
          </PageSection>
          <PageSection padded title="Produktbilder" theme={THEME_PRODUCT_ITEM_1}>
            {product.images.length > 0 && <ProductImageGallery product={product} />}
          </PageSection>
          <PageSection padded title="Kategorier" theme={THEME_PRODUCT_ITEM_2}>
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
