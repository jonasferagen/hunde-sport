import React from 'react';
import { Select, Text, YStack } from 'tamagui';

const SimpleSelectTest = () => {
    const [value, setValue] = React.useState('');

    return (
        <YStack padding="$4" space="$2">
            <Text>Test Select (Current: {value || 'None'})</Text>
            <Select value={value} onValueChange={setValue}>
                <Select.Trigger width={200}>
                    <Select.Value placeholder="Choose an option" />
                </Select.Trigger>

                <Select.Content zIndex={200000}>
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                        <Select.Group>
                            <Select.Item index={0} value="apple">
                                <Select.ItemText>Apple</Select.ItemText>
                            </Select.Item>
                            <Select.Item index={1} value="banana">
                                <Select.ItemText>Banana</Select.ItemText>
                            </Select.Item>
                            <Select.Item index={2} value="orange">
                                <Select.ItemText>Orange</Select.ItemText>
                            </Select.Item>
                            <Select.Item index={3} value="grape">
                                <Select.ItemText>Grape</Select.ItemText>
                            </Select.Item>
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select>
        </YStack>
    );
};

export default SimpleSelectTest;