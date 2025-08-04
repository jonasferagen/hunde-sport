import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Chip } from '@/components/ui';
import { CategoryProvider, useCategoryContext } from '@/contexts/CategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useCategoryStore } from '@/stores/CategoryStore';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useLocalSearchParams } from 'expo-router';
import { memo, useState } from 'react';
import { XStack } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';
import { NotFoundScreen } from './misc/NotFoundScreen';

const CategoryScreenContent = memo(() => {
    const { categories } = useCategoryContext();
    const [showAll, setShowAll] = useState(false);
    const limit = 3;

    const showToggleButton = categories && categories.length > limit;

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
                showAll={showAll}
            />
        </PageHeader>
        <PageContent f={1} p="none" theme="primary_alt2">
            <CategoryProducts />
        </PageContent>
    </PageView>
});

export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getCategoryById, isLoading } = useCategoryStore();

    const category = getCategoryById(Number(id));

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!category) {
        return <NotFoundScreen message="Beklager, kategorien ble ikke funnet" />;
    }

    return (
        <CategoryProvider category={category}>
            <CategoryScreenContent />
        </CategoryProvider>
    );
});
