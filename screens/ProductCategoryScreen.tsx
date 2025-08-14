import { BreadCrumbsContainer } from '@/components/features/breadcrumbs/BreadCrumbsContainer';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCategoryProvider } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';


export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <ProductCategoryProvider productCategoryId={Number(id)}>
            <PageView>
                <PageHeader>
                    <BreadCrumbsContainer />
                </PageHeader>
                <PageBody px="none" mode="static">
                    <ProductCategoryProducts />
                </PageBody>
            </PageView>
        </ProductCategoryProvider>);
});

