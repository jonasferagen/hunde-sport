import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { ProductCategoryDropdown } from '@/components/features/product-category/ProductCategoryDropdown';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';
import { NotFoundScreen } from './misc/NotFoundScreen';

const ProductCategoryScreenContent = memo(() => {
    const { productCategory } = useProductCategoryContext();
    useRenderGuard('ProductCategoryScreenContent');

    if (!productCategory) {
        return <NotFoundScreen message="Beklager, kategorien ble ikke funnet" />;
    }

    return <PageView>
        <PageHeader theme="soft">
            <Breadcrumbs isLastClickable={true} />
            <ProductCategoryDropdown />
        </PageHeader>
        <PageContent f={1} p="none">
            <ProductCategoryProducts />
        </PageContent>
    </PageView>
});

export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();

    return <ProductCategoryProvider productCategoryId={Number(id)}>
        <ProductCategoryScreenContent />
    </ProductCategoryProvider>
});
