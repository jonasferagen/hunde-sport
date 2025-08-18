// AttributeSelector.tsx
import { AttributeTermDetails } from '@/types';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';
// AttributeSelector.tsx (list per attribute)
export const AttributeSelector = React.memo(function AttributeSelector({
    options, onSelect, selectedValue,
}: { options: AttributeTermDetails[]; onSelect: (v: string | null) => void; selectedValue: string | null }) {
    return (
        <YStack w="100%" gap="$2">
            {options.map((item) => {
                const isSelected = selectedValue === item.name;
                const handlePress = React.useCallback(
                    () => onSelect(isSelected ? null : item.name),
                    [onSelect, isSelected, item.name]
                );
                return (
                    <AttributeOption
                        key={item.name}
                        option={item.name}
                        selectOption={handlePress}
                        isSelected={isSelected}
                        item={item}
                    />
                );
            })}
        </YStack>
    );
});