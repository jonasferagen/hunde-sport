import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { ProductCategoryProducts } from '@/components/features/product-category/ProductCategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Chip } from '@/components/ui';
import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useLocalSearchParams } from 'expo-router';
import { memo, useState } from 'react';
import { XStack } from 'tamagui';
import { NotFoundScreen } from './misc/NotFoundScreen';

const ProductCategoryScreenContent = memo(() => {
    const { productCategory, productCategories } = useProductCategoryContext();
    const [showAll, setShowAll] = useState(false);
    const limit = 3;

    useRenderGuard('ProductCategoryScreenContent');

    if (!productCategory) {
        return <NotFoundScreen message="Beklager, kategorien ble ikke funnet" />;
    }

    const showToggleButton = productCategories && productCategories.length > limit;

    return <PageView>
        <PageHeader theme="soft">
            <XStack jc="space-between" ai="center">
                <Breadcrumbs isLastClickable={true} />
                {showToggleButton && (
                    <Chip
                        theme="enhanced"
                        onPress={() => setShowAll(!showAll)}
                    >
                        {showAll ? <ChevronUp size="$4" /> : <ChevronDown size="$4" />}
                    </Chip>
                )}
            </XStack>

            <ProductCategoryChips
                limit={limit}
                showAll={showAll}
                theme="enhanced"
            />
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
