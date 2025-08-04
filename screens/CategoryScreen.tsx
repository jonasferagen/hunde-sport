import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Chip } from '@/components/ui';
import { CategoryProvider, useCategoryContext } from '@/contexts/CategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useLocalSearchParams } from 'expo-router';
import { memo, useState } from 'react';
import { XStack } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';

const CategoryScreenContent = memo(() => {
    const { isLoading, subCategories } = useCategoryContext();
    const [showAll, setShowAll] = useState(false);
    const limit = 3;

    const showToggleButton = subCategories && subCategories.length > limit;

    return <PageView>
        <PageHeader theme="primary_alt1">
            <XStack jc="space-between" ai="center">
                <Breadcrumbs isLastClickable={true} />
                {showToggleButton && (
                    <Chip
                        theme="secondary_alt1"
                        onPress={() => setShowAll(!showAll)}
                        icon={showAll ? <ChevronUp size="$4" /> : <ChevronDown size="$4" />}
                    />
                )}
            </XStack>

            <CategoryChips
                limit={limit}
                categories={subCategories}
                showAll={showAll}
            />
        </PageHeader>
        <PageContent f={1} p="none" theme="primary_alt2">
            {isLoading ? <LoadingScreen /> : <CategoryProducts />}
        </PageContent>
    </PageView>
});

export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();

    return <CategoryProvider categoryId={Number(id)}>
        <CategoryScreenContent />
    </CategoryProvider>
});
