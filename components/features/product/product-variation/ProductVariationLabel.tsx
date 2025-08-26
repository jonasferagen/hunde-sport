import { ThemedText, ThemedXStack } from '@/components/ui';
import React from 'react';
import type { TermSelection } from './ProductVariationSelect';

type Pair = { name: string; value: string };

type Props = React.ComponentProps<typeof ThemedText> & {
  currentSelection: TermSelection;
};

export const ProductSelectionStatus: React.FC<Props> = ({ currentSelection, ...textProps }) => {
  const pairs = React.useMemo<Pair[]>(() => {
    const out: Pair[] = [];
    for (const [, term] of currentSelection.entries()) {
      if (term) out.push({ name: term.taxonomy.label, value: term.label });
    }
    return out;
  }, [currentSelection]);

  if (!pairs.length) return null;

  return (
    <ThemedXStack gap="$2">
      {pairs.map(({ name, value }) => (
        <ThemedXStack key={`${name}:${value}`} gap="$1">
          <ThemedText fos="$3" tt="capitalize" height="auto" {...textProps}>
            {name}:
          </ThemedText>
          <ThemedText bold fos="$4" tt="capitalize" {...textProps}>
            {value}
          </ThemedText>
        </ThemedXStack>
      ))}
    </ThemedXStack>
  );
};
