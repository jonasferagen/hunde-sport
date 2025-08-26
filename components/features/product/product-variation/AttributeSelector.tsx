import React from 'react';
import type { Option } from '@/domain/Product/helpers/VariableProductOptions';
import { ThemedText, ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';


type AttributeSelectorProps = {
  options: Option[];                       // new shape
  selectedSlug?: string | null;            // optional for now
  onSelect?: (slug: string | null) => void;// optional for now
};

export const AttributeSelector = React.memo(function AttributeSelector({
  options,
  selectedSlug = null,
  onSelect,
}: AttributeSelectorProps) {
  return (
    <ThemedYStack w="100%" gap="$2">
      {options.map((opt) => {
        const isSelected = selectedSlug === opt.slug;
        const handlePress = () => {
          if (!onSelect) return;           // selection not wired yet
          onSelect(isSelected ? null : opt.slug);
        };

        return (
          <AttributeOption
            key={opt.slug}
            option={opt}
            isSelected={isSelected}
            onPress={handlePress}
          />
        );
      })}
    </ThemedYStack>
  );
});


type AttributeOptionProps = {
  option: Option;
  isSelected?: boolean;
  onPress?: () => void; // optional for now
};

export const AttributeOption = React.memo(function AttributeOption({
  option,
  isSelected = false,
  onPress,
}: AttributeOptionProps) {
  // You filtered out unavailable options earlier (linked.length > 0)
  return (
    <ThemedXStack ai="center" gap="$2">
      <ThemedButton
        size="$2"
        bw={2}
        aria-label={option.label}
        onPress={onPress}
        // simple visual hint; refine later
        theme={isSelected ? 'active' : undefined}
      >
        <ThemedText>{option.label}</ThemedText>
      </ThemedButton>
      {/* tiny debug / helper info; remove later if noisy */}
      <ThemedText size="$1" opacity={0.6}>
        {option.linked.length} varianter
      </ThemedText>
    </ThemedXStack>
  );
});
