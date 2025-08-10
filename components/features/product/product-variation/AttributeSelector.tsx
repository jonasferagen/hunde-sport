
import { AttributeTermDetails } from '@/types';
import React from 'react';
import { XStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    options: AttributeTermDetails[];
    onSelect: (value: string | null) => void;
    selectedValue: string | null;
}

export const AttributeSelector = ({ options, onSelect, selectedValue }: AttributeSelectorProps) => {
    return (
        <XStack
            f={1}
            minWidth={0}
            minHeight={0} // ✅ prevents collapse
            flexWrap="wrap"
            gap="$2"
        >
            {options.map((item) => {
                const isSelected = selectedValue === item.name;

                const handlePress = () => {
                    onSelect(isSelected ? null : item.name);
                };

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
        </XStack>
    );
};
