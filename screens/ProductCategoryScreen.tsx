import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCategoryProvider } from '@/contexts/ProductCategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';



export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();

    return <ProductCategoryProvider productCategoryId={Number(id)}>
        <ProductCategoryScreenContent />
    </ProductCategoryProvider>
});

const ProductCategoryScreenContent = memo(() => {

    useRenderGuard('ProductCategoryScreenContent');


    return <PageView>
        <PageHeader>
            <Breadcrumbs isLastClickable={true} />
            <ProductCategoryChips showAll={false} />
        </PageHeader>
        <PageContent f={1}>
            <ProductCategoryProducts />
        </PageContent>
    </PageView>
});