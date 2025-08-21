import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedYStack, ThemedYStackProps } from '@/components/ui/themed-components/ThemedStacks';
import React from 'react';

export const Loader = ({ ...props }: ThemedYStackProps) => {
    return (
        <ThemedYStack f={1} jc="center" ai="center" {...props}>
            <ThemedSpinner size="small" />
        </ThemedYStack>);
}

