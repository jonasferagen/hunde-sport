import { BreadCrumbsContainer } from '@/components/features/product-category/breadcrumbs/BreadCrumbsContainer';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedText } from '@/components/ui';
import { ProductCategoryProvider } from '@/contexts';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';
import { LoadingScreen } from './misc/LoadingScreen';


export const ProductCategoryScreen = memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const ready = useScreenReady();
    const { id } = useLocalSearchParams<{ id: string }>();

    if (!ready) {
        return <LoadingScreen />
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
                <PageBody p="none" boc="green" bw={3}>
                    <PageSection fill padding="none" px={0} fg={1} boc="red" bw={3} >
                        <ThemedText>Hei</ThemedText>
                    </PageSection>
                </PageBody>
            </PageView>
        </ProductCategoryProvider>
    )
});
/*<ProductCategoryProducts /> */
