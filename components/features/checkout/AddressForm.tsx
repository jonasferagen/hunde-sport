// AddressForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { PageContent, PageSection } from '@/components/layout';
import { Button } from '@/components/ui/button/Button';
import { CustomText } from '@/components/ui/text/CustomText';
import { useTheme } from '@/contexts/ThemeProvider';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';

const addressSchema = z.object({
    first_name: z.string().min(1, { message: 'Fornavn er påkrevd' }),
    last_name: z.string().min(1, { message: 'Etternavn er påkrevd' }),
    address_1: z.string().min(1, { message: 'Adresse er påkrevd' }),
    city: z.string().min(1, { message: 'By er påkrevd' }),
    postcode: z.string().min(1, { message: 'Postnummer er påkrevd' }),
    country: z.string().min(2, { message: 'Landskode er påkrevd (f.eks. NO)' }),
    email: z.string().email({ message: 'Ugyldig e-postadresse' }),
    phone: z.string().min(5, { message: 'Telefonnummer er påkrevd' }),
});

type AddressFormData = z.infer<typeof addressSchema>;

const formFields: { name: keyof AddressFormData; label: string }[] = [
    { name: 'first_name', label: 'Fornavn' },
    { name: 'last_name', label: 'Etternavn' },
    { name: 'address_1', label: 'Adresse' },
    { name: 'city', label: 'By' },
    { name: 'postcode', label: 'Postnummer' },
    { name: 'country', label: 'Landskode (f.eks. NO)' },
    { name: 'email', label: 'E-post' },
    { name: 'phone', label: 'Telefon' },
];

export const AddressForm = ({ onSubmit }: { onSubmit: (data: AddressFormData) => void }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            country: 'NO',
        },
    });
    const { themeManager } = useTheme();
    const theme = themeManager.getVariant('default');
    const styles = createStyles(theme);

    return (
        <PageSection scrollable>
            <PageContent>
                {formFields.map((field) => (
                    <Controller
                        key={field.name}
                        control={control}
                        name={field.name}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <CustomText style={styles.label}>{field.label}</CustomText>
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors[field.name] && (
                                    <CustomText color={themeManager.getAlert('error').backgroundColor}>
                                        {errors[field.name]?.message}
                                    </CustomText>
                                )}
                            </View>
                        )}
                    />
                ))}

                <Button title="Send inn" onPress={handleSubmit(onSubmit)} />
            </PageContent>
        </PageSection>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        inputContainer: {
            marginBottom: SPACING.md,
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
    });
