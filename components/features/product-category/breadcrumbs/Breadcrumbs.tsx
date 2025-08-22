// Breadcrumbs.tsx
import React from 'react';
import { H3, ScrollView } from 'tamagui';
import { ThemedButton, ThemedXStack, ThemedXStackProps } from '@/components/ui';
import { EdgeFadesOverlay } from '@/components/ui/list/EdgeFadesOverlay';
import { ProductCategory } from '@/types';
import { Breadcrumb } from './Breadcrumb';
import { useEdgeFades } from '@/hooks/useEdgeFades';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { Link } from 'expo-router';
import { Chip } from '@/components/ui/chips/Chip';

interface BreadcrumbsProps extends ThemedXStackProps {
    isLastClickable?: boolean;
    trail: readonly ProductCategory[];
}

export const Breadcrumbs = React.memo(({ isLastClickable = false, trail, ...stackProps }: BreadcrumbsProps) => {

    const edges = useEdgeFades('horizontal');
    const { linkProps } = useCanonicalNavigation();

    if (trail.length === 0) return null;
    return (
        <ThemedXStack {...stackProps} my="$3">
            <ScrollView
                horizontal
                onScroll={edges.onScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
                onLayout={edges.onLayout}
                onContentSizeChange={edges.onContentSizeChange}
                scrollEventThrottle={16}

            >
                <ThemedXStack ai="center" gap="none">
                    {trail.map((cat, index) => {
                        const isLast = index === trail.length - 1;
                        return (
                            <>
                                <Link key={cat.id} {...linkProps('product-category', cat)} asChild>
                                    <Chip theme="secondary">
                                        {cat.name}
                                    </Chip>
                                </Link>
                                {!isLast && <ChevronRight size="$2" />}
                            </>
                        )
                    })}
                </ThemedXStack>
            </ScrollView>
            <EdgeFadesOverlay
                orientation="horizontal"
                visibleStart={edges.atStart}
                visibleEnd={edges.atEnd}
            />
        </ThemedXStack>
    );
});
