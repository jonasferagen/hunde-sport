
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
        <XStack f={1} gap="$2" flexWrap="wrap">
            {options.map((item) => {

                console.log(item);

                const isSelected = selectedValue === item.name;

                const handlePress = () => {
                    onSelect(isSelected ? null : item.name);
                };

                return (
                    <AttributeOption
                        key={item.slug}
                        option={item.name}
                        selectOption={handlePress}
                        isSelected={isSelected}
                        isAvailable={item.isAvailable}
                        price={item.displayPrice}
                        inStock={item.inStock}
                    />
                );
            })}
        </XStack>
    );
};