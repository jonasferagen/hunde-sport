import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import React, { JSX } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
    name: Path<T>;
    label: string;
    control: Control<T>;
    errors: any; // react-hook-form's errors object
    containerStyle?: object;
}

export const FormField = <T extends FieldValues>({
    name,
    label,
    control,
    errors,
    containerStyle,
    ...textInputProps
}: FormFieldProps<T>): JSX.Element => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('secondary');
    const errorColor = themeManager.getAlert('error').backgroundColor;
    const styles = createStyles(theme, errorColor);
    const hasError = !!errors[name];


    return (
        <View style={[styles.inputContainer, containerStyle]}>
            <CustomText style={styles.label}>{label}</CustomText>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, hasError && styles.inputError]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholderTextColor={theme.text.secondary}
                        {...textInputProps}
                    />
                )}
            />
            {errors[name] && (
                <CustomText style={styles.errorText}>{errors[name]?.message}</CustomText>
            )}
        </View>
    );
};

const createStyles = (theme: any, error: any) =>
    StyleSheet.create({
        inputContainer: {
            flex: 1,
        },
        label: {
            marginBottom: SPACING.sm,
            color: theme.text.primary,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: theme.backgroundColor,
            padding: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            color: theme.text.primary,
        },
        inputError: {
            backgroundColor: error.backgroundColor,
        },
        errorText: {
            marginTop: SPACING.xs,
            color: error.backgroundColor,
            fontSize: 12,
        },
    });
