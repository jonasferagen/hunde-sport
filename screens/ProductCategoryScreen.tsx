import { BreadCrumbsContainer } from '@/components/features/product-category/breadcrumbs/BreadCrumbsContainer';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductCategoryProvider } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Prof } from '@/lib/debug/prof';
import { useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';
import { NotFoundScreen } from './misc/NotFoundScreen';


export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();


    if (!id) return <Prof id="categorynotfound">
        <NotFoundScreen />
    </Prof>

    return (
        <ProductCategoryProvider productCategoryId={Number(id)}>
            <PageView>
                <PageHeader>
                    <BreadCrumbsContainer />
                </PageHeader>
                <PageBody mode="static" >
                    <PageSection f={1} mih={0} p="none">
                        <ProductCategoryProducts />
                    </PageSection>
                </PageBody>
            </PageView>
        </ProductCategoryProvider>
    );
});

