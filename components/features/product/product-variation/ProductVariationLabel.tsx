// ProductSelectionStatus.tsx
import React from 'react';

import { ThemedText, ThemedXStack } from '@/components/ui';
import type { Term } from '@/domain/Product/helpers/VariableProductOptions';

import { useVariableProductStore } from '../../../../stores/useProductVariationStore';

type Props = React.ComponentProps<typeof ThemedText>;

export const ProductSelectionStatus: React.FC<Props> = ({ ...textProps }) => {
  // Fallback to store if no explicit selection is passed
  const storeSelection = useVariableProductStore(s => s.selection);

  // extract non-null terms (order preserved)
  const terms = React.useMemo(
    () => Array.from(storeSelection.values()).filter((t): t is Term => !!t),
    [storeSelection]
  );

  if (terms.length === 0) return null;

  return (
    <ThemedXStack gap="$2">
      {terms.map(term => (
        <ThemedXStack key={term.taxonomy.name} gap="$1">
          <ThemedText fos="$3" tt="capitalize" height="auto" {...textProps}>
            {term.taxonomy.label}:
          </ThemedText>
          <ThemedText bold fos="$4" tt="capitalize" {...textProps}>
            {term.label}
          </ThemedText>
        </ThemedXStack>
      ))}
    </ThemedXStack>
  );
};
