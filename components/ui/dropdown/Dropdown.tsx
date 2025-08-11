import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { Adapt, Select, Sheet, YStack } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components';

export interface DropdownOption<T extends string> {
    label: string;
    value: T; // enforce string for stability
}

interface DropdownProps<T extends string> {
    options: DropdownOption<T>[];
    value?: T;
    onValueChange: (value: T) => void;
    placeholder?: string;
}

export const Dropdown = <T extends string>({
    options,
    value,
    onValueChange,
    placeholder,
}: DropdownProps<T>) => {
    const [open, setOpen] = useState(false);

    const selectedIndex = useMemo(() => {
        return options.findIndex((option) => option.value === value);
    }, [options, value]);

    const handleValueChange = (val: string) => {
        const index = parseInt(val, 10);
        if (!isNaN(index) && options[index]) {
            onValueChange(options[index].value);
        }
    };

    return (
        <Select
            open={open}
            onOpenChange={setOpen}
            value={selectedIndex !== -1 ? selectedIndex.toString() : undefined}
            onValueChange={handleValueChange}
            disablePreventBodyScroll
        >
            <Select.Trigger
                w="100%"
                iconAfter={<ChevronDown size="$4" />}
                br="$5"
                bbw={1}
                boc="$borderColor"
                p="$3"
            >
                <Select.Value
                    fos="$4"
                    placeholder={placeholder} />
            </Select.Trigger>

            <Adapt platform="touch">
                <Sheet
                    native
                    modal
                    dismissOnSnapToBottom
                    animationConfig={{
                        type: 'spring',
                        damping: 20,
                        mass: 1.2,
                        stiffness: 250,
                    }}
                >
                    <Sheet.Frame>
                        <Sheet.ScrollView>
                            <Adapt.Contents />
                        </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                    ai="center"
                    jc="center"
                    w="100%"
                    h="$3"
                >
                    <YStack zi={10}>
                        <ChevronUp size={20} />
                    </YStack>
                    <ThemedLinearGradient />
                </Select.ScrollUpButton>

                <Select.Viewport minWidth={200}>
                    <Select.Group>
                        {options.map((item, i) => (
                            <Select.Item index={i} key={item.value} value={i.toString()}
                                theme="strong"
                                br="$3"
                                bg="$background"
                                p="$4"
                                bbw={1}
                                boc="$borderColor"
                            >
                                <Select.ItemText
                                    fos="$5"
                                    fow="bold"
                                >
                                    {item.label}

                                </Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton ai="center" jc="center" w="100%" h="$3">
                    <YStack zi={10}>
                        <ChevronDown size={20} />
                    </YStack>
                    <ThemedLinearGradient />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select>
    );
};
