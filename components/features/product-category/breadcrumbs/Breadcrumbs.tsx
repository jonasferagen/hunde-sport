// Breadcrumbs.tsx
import React from 'react';
import { ScrollView } from 'tamagui';
import { ThemedXStack } from '@/components/ui';
import { EdgeFadesOverlay } from '@/components/ui/list/EdgeFadesOverlay';
import { ProductCategory } from '@/types';
import { Breadcrumb } from './Breadcrumb';
import { useEdgeFades } from '@/hooks/useEdgeFades';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
    trail: readonly ProductCategory[];
}

export const Breadcrumbs = React.memo(({ isLastClickable = false, trail }: BreadcrumbsProps) => {

    const edges = useEdgeFades('horizontal');

    console.log(edges);
    if (trail.length === 0) return null;
    return (
        <ThemedXStack>
            <ScrollView
                horizontal
                onScroll={edges.onScroll}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}
                onLayout={edges.onLayout}
                onContentSizeChange={edges.onContentSizeChange}
                scrollEventThrottle={16}

            >
                <ThemedXStack ai="center" gap="$2">
                    {trail.map((cat, index) => (
                        <Breadcrumb
                            key={cat.id}
                            productCategory={cat}
                            isLast={index === trail.length - 1}
                            isLastClickable={isLastClickable}
                        />
                    ))}
                </ThemedXStack>
            </ScrollView>
            <EdgeFadesOverlay
                orientation="horizontal"
                visibleStart={edges.atStart}
                visibleEnd={edges.atEnd}
                bg="#fff"
            />
        </ThemedXStack>
    );
});
