import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { useScreenTitle } from '@/hooks/useScreenTitle';
import { useBreadcrumbTrail, useProductCategories, useProductCategory } from '@/stores/productCategoryStore';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Breadcrumbs } from '@/components/features/product-category/Breadcrumbs';
import { ProductCategoryHeader } from '@/components/features/product-category/ProductCategoryHeader';
import { Theme, YStack } from 'tamagui';
import { ThemedXStack } from '@/components/ui';

export const ProductCategoryScreen = React.memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const ready = useScreenReady();
    const { id } = useLocalSearchParams<{ id: string }>();
    const productCategory = useProductCategory(Number(id));
    const productCategories = useProductCategories(Number(id));
    const trail = useBreadcrumbTrail(Number(id));
    useScreenTitle(productCategory?.name);

    if (!ready) {
        return null;
    }
    if (!productCategory || productCategory.id === 0) {
        return <Redirect href="/" />;
    }

    return (
        <PageView>
            <PageHeader theme="shade">
                <ThemedXStack box split>
                    <YStack f={1}>
                        <Breadcrumbs trail={trail} isLastClickable />
                    </YStack>
                    <YStack>
                        <ProductCategoryHeader productCategory={productCategory} productCategories={productCategories} />
                    </YStack>
                </ThemedXStack>
            </PageHeader>
            <PageBody>
                <PageSection fill f={1} mih={0}>
                    <ProductCategoryProducts productCategory={productCategory} />
                </PageSection>
            </PageBody>
        </PageView >
    )
});
