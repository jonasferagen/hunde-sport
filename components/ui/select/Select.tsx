import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';

interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    label: string;
    options: SelectOption[];
    selectedValue: string | number;
    onValueChange: (value: string | number) => void;
    enabled?: boolean;
}

export const Select = ({ label, options, selectedValue, onValueChange, enabled = true }: SelectProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');

    const styles = StyleSheet.create({
        container: {
            marginBottom: SPACING.md,
        },
        label: {
            marginBottom: SPACING.sm,
            fontSize: 16,
            color: theme.text.primary,
        },
        pickerContainer: {
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: theme.backgroundColor,
            justifyContent: 'center',
        },
        picker: {
            color: theme.text.primary,
        },
    });

    return (
        <View style={styles.container}>
            {label ? <CustomText style={styles.label}>{label}</CustomText> : null}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => onValueChange(itemValue)}
                    style={styles.picker}
                    enabled={enabled}
                >
                    {options.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};
