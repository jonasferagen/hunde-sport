import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { useScreenTitle } from '@/hooks/useScreenTitle';
import { useBreadcrumbTrail, useProductCategories, useProductCategory } from '@/stores/productCategoryStore';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Breadcrumbs } from '@/components/features/product-category/breadcrumbs/Breadcrumbs';
import { ProductCategoryHeader } from '@/components/features/product-category/ProductCategoryHeader';
import { Theme } from 'tamagui';

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
    if (!productCategory) {
        return <Redirect href="/" />;
    }

    return (
        <PageView>
            <PageHeader theme="shade">
                <Breadcrumbs trail={trail} isLastClickable />
                <ProductCategoryHeader productCategories={productCategories} container box />
            </PageHeader>
            <PageBody>
                <PageSection fill f={1} mih={0}>
                    <ProductCategoryProducts productCategory={productCategory} />
                </PageSection>
            </PageBody>
        </PageView>
    )
});
