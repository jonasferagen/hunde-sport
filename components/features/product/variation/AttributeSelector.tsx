import { Loader } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { calculatePriceRange } from '@/hooks/usePriceRange';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { formatPriceRange } from '@/utils/helpers';
import React, { useState } from 'react';
import { Adapt, Select, Sheet, XStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    currentAvailableOptions: Map<string, Product[]> | undefined;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
    selectedOptions: Record<number, string>;
    isFirst: boolean;
    isLast: boolean;
}

interface OptionRendererProps {
    option: any;
    disabled?: boolean;
    isSelected?: boolean;
    matchingVariants?: Product[];
    selectedOptions: Record<number, string>;
    isFirst: boolean;
    isLast: boolean;
    isLoading: boolean;
}

const OptionRenderer = ({ option, disabled, isSelected, matchingVariants, selectedOptions, isFirst, isLast, isLoading }: OptionRendererProps) => {

    const priceRange = calculatePriceRange(matchingVariants);

    const opacity = isFirst ? 0.5 : 1;

    const fontSize = isFirst ? "xs" : "sm";

    return (
        <XStack
            flex={1}
            backgroundColor={isSelected ? '$backgroundFocus' : 'transparent'}
            paddingVertical={"\$2"}
            paddingHorizontal={"\$1"}
            justifyContent='space-between'
            alignItems='center'
        >
            <XStack gap={"\$2"}>
                <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', textDecorationLine: disabled ? 'line-through' : 'none' }}>
                    {option.label}
                </CustomText>
            </XStack>
            {isLoading ? <Loader /> : matchingVariants && (
                matchingVariants.length === 1 ? (
                    <XStack opacity={opacity}>
                        <PriceTag product={matchingVariants[0]} />
                    </XStack>
                ) : <XStack opacity={opacity} alignItems='flex-end'>
                    <CustomText fontSize={fontSize}>
                        {priceRange && formatPriceRange(priceRange)}
                    </CustomText>
                </XStack>
            )}
        </XStack>
    );
};

export const AttributeSelector = ({ attribute, options, currentSelection, currentAvailableOptions, handleOptionSelect, isLoading, selectedOptions, isFirst, isLast }: AttributeSelectorProps) => {
    const useFullscreen = options.length > 10; // Adjust threshold as needed
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o) => o.name === currentSelection);


    return (
        <Select
            key={`${attribute.id}-${currentSelection}`}
            value={currentSelection}
            onValueChange={(v) => { handleOptionSelect(attribute.id, v); }}
            disablePreventBodyScroll
            onOpenChange={(v) => setIsOpen(v)}
            open={isOpen}
        >
            <Select.Trigger >
                <Select.Value>
                    {selectedOption ? (
                        <OptionRenderer
                            option={selectedOption}
                            isSelected={true}
                            selectedOptions={selectedOptions}
                            isFirst={isFirst}
                            isLast={isLast}
                            isLoading={isLoading}
                        />
                    ) : (
                        'Velg et alternativ'
                    )}
                </Select.Value>
            </Select.Trigger>
            {useFullscreen && (
                <Adapt platform="touch">
                    <Sheet modal dismissOnSnapToBottom snapPoints={[90]} animation="medium">
                        <Sheet.Overlay
                            backgroundColor="$shadowColor"
                            animation="medium"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                        <Sheet.Frame padding="$4">
                            <Sheet.ScrollView>
                                <Adapt.Contents />
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                    </Sheet>
                </Adapt>
            )}
            <Select.Content zIndex={2000} >
                <Select.ScrollUpButton />
                <Select.Viewport>
                    <Select.Group display={isOpen ? 'flex' : 'none'}>
                        {options.map((option, index) => {
                            const matchingVariants = currentAvailableOptions?.get(option.name!)
                            const isDisabled = !matchingVariants || matchingVariants.length === 0;
                            const isSelected = currentSelection === option.name;
                            return (
                                <Select.Item
                                    key={option.name + attribute.id + index}
                                    index={index}
                                    value={option.name!}
                                    disabled={isDisabled}

                                >
                                    <OptionRenderer
                                        option={option}
                                        disabled={isDisabled}
                                        isSelected={isSelected}
                                        matchingVariants={matchingVariants}
                                        selectedOptions={selectedOptions}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        isLoading={isLoading}
                                    />
                                </Select.Item>
                            )
                        })}
                    </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
            </Select.Content>
        </Select >
    )
}
