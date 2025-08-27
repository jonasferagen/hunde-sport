import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { YStack } from 'tamagui';

import { Breadcrumbs } from '@/components/features/product-category/Breadcrumbs';
import { ProductCategoryHeader } from '@/components/features/product-category/ProductCategoryHeader';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedXStack } from '@/components/ui';
import { useScreenReady } from '@/hooks/ui/useScreenReady';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useBreadcrumbTrail, useProductCategories, useProductCategory } from '@/stores/productCategoryStore';

export const ProductCategoryScreen = React.memo(() => {
    useRenderGuard('ProductCategoryScreen');
    const ready = useScreenReady();
    const { id } = useLocalSearchParams<{ id: string }>();
    const productCategory = useProductCategory(Number(id));
    const productCategories = useProductCategories(Number(id));
    const trail = useBreadcrumbTrail(Number(id));

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
