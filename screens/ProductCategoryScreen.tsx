import { BreadCrumbsContainer } from '@/components/features/product-category/breadcrumbs/BreadCrumbsContainer';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCategoryProvider } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { useScreenTitle } from '@/hooks/useScreenTitle';
import { useBreadcrumbTrail } from '@/stores/productCategoryStore';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';


export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const ready = useScreenReady();
    const { id } = useLocalSearchParams<{ id: string }>();

    const trail = useBreadcrumbTrail(Number(id));
    useScreenTitle(trail[0]?.name);

    if (!ready) {
        return null;
    }
    if (!id) {
        return <Redirect href="/" />;
    }

    return (
        <ProductCategoryProvider productCategoryId={Number(id)}>
            <PageView>
                <PageHeader>
                    <BreadCrumbsContainer />
                </PageHeader>
                <PageBody >
                    <PageSection fill f={1} mih={0}>
                        <ProductCategoryProducts />
                    </PageSection>
                </PageBody>
            </PageView>
        </ProductCategoryProvider>
    )
});
