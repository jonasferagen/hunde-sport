// Breadcrumbs.tsx
import React from 'react';
import { ScrollView } from 'tamagui';
import { Link } from 'expo-router';
import { ChevronRight } from '@tamagui/lucide-icons';
import { ThemedXStack, ThemedText, ThemedXStackProps } from '@/components/ui';
import { EdgeFadesOverlay } from '@/components/ui/list/EdgeFadesOverlay';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { useEdgeFades } from '@/hooks/useEdgeFades';
import type { ProductCategory } from '@/types';

interface BreadcrumbsProps extends ThemedXStackProps {
    isLastClickable?: boolean;
    trail: readonly ProductCategory[];
}

export const Breadcrumbs = React.memo(
    ({ isLastClickable = false, trail, ...stackProps }: BreadcrumbsProps) => {
        const edges = useEdgeFades('horizontal');
        if (trail.length === 0) return null;

        return (
            <ThemedXStack {...stackProps} my="$3" pos="relative">
                <ScrollView
                    horizontal
                    onLayout={edges.onLayout}
                    onContentSizeChange={edges.onContentSizeChange}
                    onScroll={edges.onScroll}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
                >
                    <ThemedXStack ai="center" gap="$1.5">
                        {trail.map((cat, idx) => (
                            <Breadcrumb
                                key={cat.id}
                                category={cat}
                                isLast={idx === trail.length - 1}
                                isLastClickable={isLastClickable}
                            />
                        ))}
                    </ThemedXStack>
                </ScrollView>

                <EdgeFadesOverlay
                    orientation="horizontal"
                    visibleStart={edges.atStart}
                    visibleEnd={edges.atEnd}
                />
            </ThemedXStack>
        );
    }
);

// --- local component ---
interface BreadcrumbProps {
    category: ProductCategory;
    isLast: boolean;
    isLastClickable: boolean;
}

const Breadcrumb = ({ category, isLast, isLastClickable }: BreadcrumbProps) => {
    const { linkProps } = useCanonicalNavigation();
    const clickable = !isLast || isLastClickable;

    const TextEl = (
        <ThemedText
            size="$6"
            fow={clickable ? 'bold' : 'normal'}
            textDecorationLine={clickable ? 'underline' : 'none'}
            px="$2"
            py="$1"
            numberOfLines={1}
        >
            {category.name}
        </ThemedText>
    );

    return (
        <ThemedXStack ai="center" gap="$1">
            {clickable ? (
                <Link {...linkProps('product-category', category)} asChild>
                    {TextEl}
                </Link>
            ) : (
                TextEl
            )}
            {!isLast && <ChevronRight size="$2" />}
        </ThemedXStack>
    );
};
